import { Box, Button, Input, Text, Heading, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Task, Kid } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TaskWithKid extends Task {
  soc_final_kids: Kid;
  completed: boolean;
}

interface TaskHistoryWithKid {
  id: number;
  name: string;
  completed_by: number;
  reward_value: number;
  soc_final_kids: {
    id: number;
    name: string;
    parent_id: number;
    completed: boolean;
    currency: number;
  } | null;
}

const TaskView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithKid[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistoryWithKid[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [taskName, setTaskName] = useState("");
  const [rewardValue, setRewardValue] = useState(1);
  const [selectedKidId, setSelectedKidId] = useState<number | "all">("all");
  const [loading, setLoading] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null); // Track individual task loading state
  const [newTaskCompleted, setNewTaskCompleted] = useState(false);

  const showToast = (message: string) => {
    toast(message);
  };

  const fetchTasks = async () => {
    try {
      // ✅ Step 1: Get the logged-in parent's ID
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user)
        throw new Error("User not authenticated");

      const authUserId = userData.user.id;
      const { data: parentData, error: parentError } = await supabase
        .from("soc_final_parents")
        .select("id")
        .eq("auth_id", authUserId)
        .single();

      if (parentError) throw new Error("Parent not found");

      const parentId = parentData.id;

      // ✅ Step 2: Fetch only tasks where the assigned child's parent matches the logged-in parent
      // ✅ Fetch only tasks assigned to the parent's kids, ensuring soc_final_kids is a single object
      const { data: tasksData, error: tasksError } = await supabase
        .from("soc_final_tasks")
        .select(
          "id, name, assigned_to, reward_value, completed, soc_final_kids!inner(id, name, parent_id)" // ✅ Added 'completed' here
        )
        .eq("soc_final_kids.parent_id", parentId);

      if (tasksError) throw new Error("Error fetching tasks");

      // ✅ Step 3: Remove tasks where the assigned child is null (in case of bad data)
      const filteredTasks: TaskWithKid[] = tasksData.map((task) => ({
        ...task,
        soc_final_kids: task.soc_final_kids as unknown as {
          id: number;
          name: string;
          parent_id: number;
          completed: boolean;
          currency: number;
        },
      }));

      console.log("Filtered Tasks Data:", filteredTasks); // ✅ Debugging Log
      console.log("This is the tasks Data:", tasksData);
      setTasks(filteredTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchTaskHistory = async () => {
    try {
      // ✅ Step 1: Get the logged-in parent's ID
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user)
        throw new Error("User not authenticated");

      const authUserId = userData.user.id;
      const { data: parentData, error: parentError } = await supabase
        .from("soc_final_parents")
        .select("id")
        .eq("auth_id", authUserId)
        .single();

      if (parentError) throw new Error("Parent not found");

      const parentId = parentData.id;

      // ✅ Step 2: Fetch only completed tasks where the child's parent matches the logged-in parent
      // ✅ Fetch only completed tasks where the parent's child matches
      const { data: taskHistoryData, error: taskHistoryError } = await supabase
        .from("soc_final_task_history")
        .select(
          "id, name, completed_by, reward_value, soc_final_kids!inner(id, name, parent_id)"
        ) // Fix here
        .eq("soc_final_kids.parent_id", parentId);

      if (taskHistoryError) throw new Error("Error fetching task history");

      // ✅ Type filteredTaskHistory correctly
      const filteredTaskHistory: TaskHistoryWithKid[] = taskHistoryData
        .map((task) => ({
          ...task,
          soc_final_kids: task.soc_final_kids[0] as {
            id: number;
            name: string;
            parent_id: number;
            completed: boolean;
            currency: number;
          },
        }))
        .filter((task) => task.soc_final_kids !== null);
      console.log("Filtered Task History Data:", filteredTaskHistory); // ✅ Debugging Log
      setTaskHistory(filteredTaskHistory);
      // ✅ Step 3: Remove tasks where the completed child is null (in case of bad data)
      // const filteredTaskHistory = taskHistoryData.filter(
      //   (task) => task.soc_final_kids !== null
      // );

      setTaskHistory(filteredTaskHistory);
    } catch (err) {
      console.error("Error fetching task history:", err);
    }
  };

  useEffect(() => {
    const fetchKids = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) return;

      const authUserId = userData.user.id;
      const { data: parentData, error: parentError } = await supabase
        .from("soc_final_parents")
        .select("id")
        .eq("auth_id", authUserId)
        .single();
      if (parentError) return;

      const parentId = parentData.id;
      const { data: kidsData, error: tasksError } = await supabase
        .from("soc_final_kids")
        .select("id, parent_id, name, currency")
        .eq("parent_id", parentId);
      if (tasksError) throw new Error("Error fetching tasks");

      setKids(kidsData as Kid[]);
    };

    fetchTasks();
    fetchTaskHistory();
    fetchKids();
  }, []);

  useEffect(() => {
    if (newTaskCompleted) {
      const timer = setTimeout(() => {
        setNewTaskCompleted(false);
      }, 5000); // ⏳ 5 seconds

      return () => clearTimeout(timer); // Cleanup when component unmounts
    }
  }, [newTaskCompleted]);

  const createTask = async () => {
    if (!taskName.trim() || rewardValue <= 0) return;

    setLoading(true);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user)
        throw new Error("User not authenticated");

      const authUserId = userData.user.id;
      const { data: parentData, error: parentError } = await supabase
        .from("soc_final_parents")
        .select("id")
        .eq("auth_id", authUserId)
        .single();
      if (parentError) throw new Error("Parent not found");

      const parentId = parentData.id;
      let assignedKids = kids.map((kid) => kid.id);
      if (selectedKidId !== "all") assignedKids = [selectedKidId];

      for (const kidId of assignedKids) {
        const { error } = await supabase.from("soc_final_tasks").insert([
          {
            name: taskName,
            created_by: parentId,
            assigned_to: kidId,
            reward_value: rewardValue,
          },
        ]);

        if (error) throw new Error("Error creating task");
      }

      setTaskName("");
      setRewardValue(1);
      setSelectedKidId("all");
      showToast("Task created successfully");
      await fetchTasks();
    } catch (err: unknown) {
      console.error("Error:", err);
      showToast("Error creating task");
    }

    setLoading(false);
  };

  const completeTask = async (task: TaskWithKid) => {
    setLoadingTaskId(task.id); // Set loading state for the specific task
    try {
      const { data: kidData, error: kidError } = await supabase
        .from("soc_final_kids")
        .select("currency")
        .eq("id", task.assigned_to)
        .single();

      if (kidError || !kidData)
        throw new Error("Error fetching kid's current currency");

      const newCurrency = kidData.currency + task.reward_value;

      const { error: historyError } = await supabase
        .from("soc_final_task_history")
        .insert([
          {
            name: task.name,
            completed_by: task.assigned_to,
            reward_value: task.reward_value,
          },
        ]);

      if (historyError) throw new Error("Error moving task to history");

      const { error: updateError } = await supabase
        .from("soc_final_kids")
        .update({ currency: newCurrency })
        .eq("id", task.assigned_to);

      if (updateError) throw new Error("Error updating currency");

      const { error: deleteError } = await supabase
        .from("soc_final_tasks")
        .delete()
        .eq("id", task.id);

      if (deleteError) throw new Error("Error deleting task");

      await fetchTasks();
      await fetchTaskHistory();
      setNewTaskCompleted(true); // ✅ Notify parent that a new task was completed

      showToast("Task completed successfully");
    } catch (err: unknown) {
      console.error("Error:", err);
      showToast("Error completing task");
    }
    setLoadingTaskId(null); // Reset loading state for the specific task
  };

  return (
    <ProtectedRoute>
      <Box p={6}>
        <Heading mb={4} style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
          Task View
        </Heading>

        {/* ------------------------------- Task Creation Form ------------------------------- */}
        <Box
          bg="#B2DFDB"
          p={4}
          rounded="md"
          mb={4}
          borderWidth="1px"
          borderColor="#80CBC4"
          shadow="lg"
        >
          <Heading size="md" mb={2} style={{ fontWeight: "bold" }}>
            Create Task
          </Heading>
          <div>
            <label htmlFor="taskName" style={{ fontWeight: "bold" }}>
              Task Name
            </label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Name"
              variant="outline"
              _hover={{ borderColor: "#80CBC4", borderWidth: "2px" }}
            />
          </div>

          <div>
            <label htmlFor="rewardValue" style={{ fontWeight: "bold" }}>
              Reward Value
            </label>
            <Input
              id="rewardValue"
              type="number"
              value={rewardValue}
              onChange={(e) => setRewardValue(parseInt(e.target.value, 10))}
              placeholder="Reward Value"
              min="1"
              variant="outline"
              _hover={{ borderColor: "#80CBC4", borderWidth: "2px" }}
            />
          </div>

          <div>
            <label htmlFor="kidSelect" style={{ fontWeight: "bold" }}>
              Assign to Kid
            </label>
            <select
              id="kidSelect"
              value={selectedKidId}
              onChange={(e) => {
                setSelectedKidId(
                  e.target.value === "all"
                    ? "all"
                    : parseInt(e.target.value, 10)
                );
              }}
              style={{
                padding: "8px",
                borderRadius: "4px",
                borderWidth: "1px",
                borderColor: "#80CBC4",
              }}
            >
              <option value="all">All Kids</option>
              {kids.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            colorScheme="teal"
            onClick={createTask}
            mt={3}
            bg="white"
            color="black"
            shadow="md"
            _hover={{ bg: "#80CBC4", color: "black" }}
            _active={{ bg: "#80CBC4" }}
          >
            {loading ? <Spinner size="sm" /> : "Create Task"}
          </Button>
        </Box>

        {/* ---------------------------- Task List --------------------------------- */}
        {tasks.length > 0 && (
          <Box mb={6}>
            <Box display="flex" alignItems="center">
              <Heading size="md" mb={2} style={{ fontWeight: "bold" }}>
                Assigned Tasks
              </Heading>
              {newTaskCompleted && (
                <Text ml={3} color="red.500" fontWeight="bold">
                  New Task Completed! ✅
                </Text>
              )}
            </Box>

            <Box display="flex" alignItems="center">
              <Heading size="md" mb={2} style={{ fontWeight: "bold" }}>
                Assigned Tasks
              </Heading>
              {newTaskCompleted && (
                <Text ml={3} color="red.500" fontWeight="bold">
                  New Task Completed! ✅
                </Text>
              )}
            </Box>

            {tasks.map((task) => (
              <Box
                key={task.id}
                p={3}
                bg="#B2DFDB"
                rounded="md"
                mb={2}
                borderWidth="1px"
                borderColor="#80CBC4"
                shadow="lg"
              >
                <Text fontWeight="bold">
                  {task.name}
                  {task.completed ? "✅" : "❌"}
                </Text>
                <Text>
                  Assigned to: {task.soc_final_kids?.name || "Unknown"}
                </Text>
                <Text>Reward: {task.reward_value} coins</Text>

                <Button
                  colorScheme="teal"
                  onClick={() => completeTask(task)}
                  mt={2}
                  bg="white"
                  color="black"
                  shadow="md"
                  _hover={{ bg: "#80CBC4" }}
                  _active={{ bg: "#80CBC4" }}
                >
                  {loadingTaskId === task.id ? (
                    <Spinner size="sm" />
                  ) : (
                    "Complete Task"
                  )}
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {/* ----------------------------- Task History Section ----------------------------- */}
        {taskHistory.length > 0 && (
          <Box mt={6}>
            <Heading size="md" mb={2} style={{ fontWeight: "bold" }}>
              Task History
            </Heading>
            {taskHistory.map((task) => (
              <Box
                key={task.id}
                p={3}
                bg="#B2EBF2"
                rounded="md"
                mb={2}
                borderWidth="1px"
                borderColor="#80CBC4"
                shadow="lg"
              >
                <Text fontWeight="bold">{task.name}</Text>
                <Text>
                  Completed by: {task.soc_final_kids?.name || "Unknown"}
                </Text>
                <Text>Reward Earned: {task.reward_value} coins</Text>
              </Box>
            ))}
          </Box>
        )}

        <ToastContainer />
      </Box>
    </ProtectedRoute>
  );
};

export default TaskView;
