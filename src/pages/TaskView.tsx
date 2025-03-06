import { Box, Button, Input, Text, Heading, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { Task, Kid } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TaskWithKid extends Task {
  soc_final_kids: Kid;
}

const TaskView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithKid[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskWithKid[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [taskName, setTaskName] = useState("");
  const [rewardValue, setRewardValue] = useState(1);
  const [selectedKidId, setSelectedKidId] = useState<number | "all">("all");
  const [loading, setLoading] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null); // Track individual task loading state

  const showToast = (message: string) => {
    toast(message);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("soc_final_tasks")
        .select("*, soc_final_kids(id, name)");
      if (error) console.error(error);
      else setTasks(data);
    };

    const fetchTaskHistory = async () => {
      const { data, error } = await supabase
        .from("soc_final_task_history")
        .select("*, soc_final_kids(id, name)");
      if (error) console.error(error);
      else setTaskHistory(data);
    };

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
      const { data: kidsData, error: kidsError } = await supabase
        .from("soc_final_kids")
        .select("id, parent_id, name, currency")
        .eq("parent_id", parentId);
      if (kidsError) return;

      setKids(kidsData as Kid[]);
    };

    fetchTasks();
    fetchTaskHistory();
    fetchKids();
  }, []);

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

      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
      setTaskHistory((prevHistory) => [...prevHistory, task]);
      showToast("Task completed successfully");
    } catch (err: unknown) {
      console.error("Error:", err);
      showToast("Error completing task");
    }
    setLoadingTaskId(null); // Reset loading state for the specific task
  };

  return (
    <ProtectedRoute>
      <Box p={6} fontFamily= "'Poppins', sans-serif">
        <Heading mb={4} style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
          Task View
        </Heading>

        {/* ------------------------------- Task Creation Form ------------------------------- */}
        <Box
          bg="#B2DFDB"
          p={4}
          rounded="md"
          mb={4}
          // borderWidth="1px"
          // borderColor="#80CBC4"
          shadow="lg"
        >
          <Heading size="xl" mb={2} style={{ fontWeight: "bold" }}>
            Create Task
          </Heading>
          <Box p={2}
              mt={2}
              mb={2}>
            <label htmlFor="taskName" style={{ fontWeight: "bold" }}>
              Task Name
            </label>
            <Input
              p={2}
              m={2}
              id="taskName"
              value={taskName}
              bg="white"
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Name"
              variant="outline"
              _hover={{ borderColor: "#80CBC4", borderWidth: "1px" }}
            />
          </Box>

          <Box p={2}
              mt={2}
              mb={2}>
            <label htmlFor="rewardValue" style={{ fontWeight: "bold" }}>
              Reward Value
            </label>
            <Input
              p={2}
              m={2}
              id="rewardValue"
              type="number"
              bg="white"
              value={rewardValue}
              onChange={(e) => setRewardValue(parseInt(e.target.value, 10))}
              placeholder="Reward Value"
              min="1"
              variant="outline"
              _hover={{ borderColor: "#80CBC4", borderWidth: "2px" }}
            />
          </Box>

          <div>
            <Box p={2}
              mt={2}>
                <Box p={2}>
            <label htmlFor="kidSelect" style={{ fontWeight: "bold" }} >
              Assign to Kid
            </label>
            </Box>
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
            </Box>
          </div>

          <Button
            colorScheme="teal"
            onClick={createTask}
            mt={3}
            bg="purple"
            color="white"
            shadow="md"
            _hover={{ bg: "indigo", color: "white" }}
            _active={{ bg: "indigo" }}
          >
            {loading ? <Spinner size="sm" /> : "Create Task"}
          </Button>
        </Box>

        {/* ---------------------------- Task List --------------------------------- */}
        {tasks.length > 0 && (
          <Box mb={6}>
            <Heading size="xl" mb={2} style={{ fontWeight: "bold" }}>
              Assigned Tasks
            </Heading>
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
                <Text fontWeight="bold">{task.name}</Text>
                <Text>
                  Assigned to: {task.soc_final_kids?.name || "Unknown"}
                </Text>
                <Text>Reward: {task.reward_value} coins</Text>
                <Button
                  colorScheme="teal"
                  onClick={() => completeTask(task)}
                  mt={2}
                  bg="purple"
                  color="white"
                  shadow="md"
                  _hover={{ bg: "indigo", color: "white" }}
                  _active={{ bg: "indigo" }}
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
            <Heading size="xl" mb={2} style={{ fontWeight: "bold" }}>
              Task History
            </Heading>
            {taskHistory.map((task) => (
              <Box
                key={task.id}
                p={3}
                bg="gray.300"
                rounded="md"
                mb={2}
                shadow="md"
                color= "gray.500"
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
