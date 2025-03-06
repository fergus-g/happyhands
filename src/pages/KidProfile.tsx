import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { Kid, Reward } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

const KidProfile: React.FC = () => {
  const { id } = useParams();
  const [kid, setKid] = useState<Kid | null>(null);
  const [tasks, setTasks] = useState<
    { id: number; name: string; reward_value: number; completed?: boolean }[]
  >([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchKidData = async () => {
      if (!id) return;

      const kidId = parseInt(id, 10);
      if (isNaN(kidId)) return;

      console.log("Checking kid ID:", kidId);

      // Fetch kid details
      const { data: kidData, error: kidError } = await supabase
        .from("soc_final_kids")
        .select("id, parent_id, name, currency")
        .eq("id", kidId)
        .single();

      if (kidError) {
        console.error("Error fetching kid:", kidError);
        return;
      }

      console.log("🎯 Kid Data Fetched:", kidData);
      setKid(kidData);
      const parentId = kidData.parent_id;

      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("soc_final_rewards")
        .select("*")
        .eq("parent_id", parentId);

      if (rewardsError) {
        console.error("Error fetching rewards:", rewardsError);
        return;
      }
      setRewards(rewardsData || []);
      console.log("🏆 Rewards Fetched:", rewardsData);

      // Fetch tasks
      console.log("📡 Fetching tasks for kid ID:", kidId);
      const { data: tasksData, error: tasksError } = await supabase
        .from("soc_final_tasks")
        .select("id, name, reward_value, completed")
        .eq("assigned_to", kidId);

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError);
        return;
      }
      setTasks(tasksData || []);
      console.log("Fetched Tasks for Kid:", tasksData);
    };

    fetchKidData();
  }, [id]);

  const markTaskComplete = async (taskId: number) => {
    console.log("✅ Marking task as complete:", taskId);
    try {
      const { data, error } = await supabase
        .from("soc_final_tasks")
        .update({ completed: true })
        .eq("id", taskId)
        .select();

      if (error) {
        console.error("❌ Error marking task as complete:", error);
        return;
      }

      console.log("🆕 Updated Task Data from Supabase:", data);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const redeemReward = async (reward: Reward) => {
    if (!kid || kid.currency < reward.cost) return;

    setLoading(true);
    try {
      const { data: updatedKid, error: updateError } = await supabase
        .from("soc_final_kids")
        .update({ currency: kid.currency - reward.cost })
        .eq("id", kid.id)
        .select()
        .single();

      if (updateError) throw new Error("Error updating currency");
      setKid(updatedKid);

      const { error: redeemError } = await supabase
        .from("soc_final_redeemed_rewards")
        .insert([
          { kid_id: kid.id, reward_id: reward.id, parent_id: kid.parent_id },
        ]);

      if (redeemError) throw new Error("Error adding redeemed reward");

      setRewards(rewards.filter((r) => r.id !== reward.id));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  if (!kid) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      {showConfetti && <Confetti width={width} height={height} />}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={6}
        shadow="md"
        bg="#80CBC4"
        minH="100%"
        width="100%"
      >
        <Stack p={6} align="center" w="full" bg="white">
          <Heading as="h2" size="2xl" fontWeight="bold">
            {kid.name}'s Profile
          </Heading>
          <AvatarGroup size="md" max={2}>
            <Avatar
              name={kid.name}
              src="https://i.ytimg.com/vi/eXwZMAz9Vh8/maxresdefault.jpg"
            />
          </AvatarGroup>
          <Text textAlign="center" fontSize="xl">
            <strong>Coins:</strong> {kid.currency} 🪙
          </Text>

          <Heading
            as="h3"
            size="md"
            fontWeight="bold"
            textAlign="center"
            mt={4}
          >
            Assigned Tasks
          </Heading>
          {tasks.length > 0 ? (
            <Stack>
              {tasks.map((task) => (
                <Box
                  key={task.id}
                  p={3}
                  bg="white"
                  borderRadius="xl"
                  shadow="md"
                >
                  <Text>
                    <strong>{task.name}</strong> - {task.reward_value} coins
                  </Text>
                  <Button
                    colorScheme="green"
                    onClick={() => markTaskComplete(task.id)}
                    disabled={task.completed}
                  >
                    {task.completed ? "Task Completed ✅" : "Complete Task"}
                  </Button>
                </Box>
              ))}
            </Stack>
          ) : (
            <Text>No tasks assigned.</Text>
          )}
        </Stack>
      </Box>
    </ProtectedRoute>
  );
};

export default KidProfile;