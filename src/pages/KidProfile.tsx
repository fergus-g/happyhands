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

const KidProfile: React.FC = () => {
  const { id } = useParams();
  const [kid, setKid] = useState<Kid | null>(null);
  const [tasks, setTasks] = useState<
    { id: number; name: string; reward_value: number }[]
  >([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKidData = async () => {
      if (!id) return;

      const kidId = parseInt(id, 10);
      if (isNaN(kidId)) return;

      // ✅ Fetch kid details
      const { data: kidData, error: kidError } = await supabase
        .from("soc_final_kids")
        .select("id, parent_id, name, currency")
        .eq("id", kidId)
        .single();

      if (kidError) {
        console.error("Error fetching kid:", kidError);
        return;
      }

      setKid(kidData);
      const parentId = kidData.parent_id;

      // ✅ Fetch rewards created by the parent
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("soc_final_rewards")
        .select("*")
        .eq("parent_id", parentId);

      if (rewardsError) {
        console.error("Error fetching rewards:", rewardsError);
        return;
      }

      setRewards(rewardsData);

      // ✅ Fetch tasks assigned to this kid
      const { data: tasksData, error: tasksError } = await supabase
        .from("soc_final_tasks")
        .select("id, name, reward_value")
        .eq("assigned_to", kidId); // ✅ Fetch only tasks assigned to this child

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError);
        return;
      }

      setTasks(tasksData);
    };

    fetchKidData();
  }, [id]);

  const markTaskComplete = async (taskId: number) => {
    try {
      const { error } = await supabase
        .from("soc_final_tasks")
        .update({ completed: true })
        .eq("id", taskId);

      if (error) throw new Error("Error marking task as complete");

      // ✅ Update local state so UI updates immediately
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
      // ✅ Deduct reward cost from the kid's currency
      const { error: updateError } = await supabase
        .from("soc_final_kids")
        .update({ currency: kid.currency - reward.cost })
        .eq("id", kid.id);

      if (updateError) throw new Error("Error updating currency");

      // ✅ Insert into soc_final_redeemed_rewards
      const { error: redeemError } = await supabase
        .from("soc_final_redeemed_rewards")
        .insert([
          { kid_id: kid.id, reward_id: reward.id, parent_id: kid.parent_id },
        ]);

      if (redeemError) throw new Error("Error adding redeemed reward");

      // ✅ Update local state
      setKid({ ...kid, currency: kid.currency - reward.cost });
      setRewards(rewards.filter((r) => r.id !== reward.id));
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  if (!kid) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={6}
        shadow="md"
        bg="#80CBC4"
      >
        <Box
          display="flex"
          w="50%"
          justifyContent="center"
          alignItems="center"
          p={3}
          shadow="md"
          bg="white"
          borderRadius="xl"
        >
          <Stack p={6} align="center" w="full" bg="white">
            {/* Kid's Profile Header */}
            <Heading
              as="h2"
              size="2xl"
              fontWeight="bold"
              bg="white"
              p={6}
              borderRadius="md"
              w="full"
              textAlign="center"
            >
              {kid.name}'s Profile
              <AvatarGroup p={4}>
                <Avatar.Root>
                  <Avatar.Fallback name={`${kid.name}'s Avatar`} />

                  <Avatar.Image src="https://i.ytimg.com/vi/eXwZMAz9Vh8/maxresdefault.jpg" />
                </Avatar.Root>
              </AvatarGroup>
            </Heading>

            {/* Coins Info */}
            <Text textAlign="center" bg="white">
              <strong>Coins:</strong> {kid.currency || 0}
            </Text>

            {/* ------------------ Assigned Tasks -------------------- */}
            <Heading
              as="h3"
              size="md"
              fontWeight="bold"
              textAlign="center"
              mt={4}
              bg="white"
            >
              Assigned Tasks
            </Heading>
            {tasks.length > 0 ? (
              <Stack p={4} w="full" align="center">
                {tasks.map((task) => (
                  <Box
                    key={task.id}
                    p={3}
                    bg="white"
                    borderRadius="xl"
                    w="full"
                    textAlign="center"
                    shadow="md"
                  >
                    <Text bg="white" p={3} mt={4}>
                      <strong>{task.name}</strong> - {task.reward_value} coins
                    </Text>
                    <Button
                      colorScheme="green"
                      onClick={() => markTaskComplete(task.id)}
                      mt={2}
                      bg="white"
                      color="black"
                      shadow="md"
                      _hover={{ bg: "#80CBC4" }}
                      _active={{ bg: "#80CBC4" }}
                      disabled={task.completed} // ✅ Disable if already completed
                    >
                      {task.completed
                        ? "Task Completed ✅"
                        : "I Have Completed This Task"}
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text>No tasks assigned.</Text>
            )}

            {/* ------------------ Reward Redemption Section -------------------- */}
            <Heading
              as="h3"
              size="md"
              fontWeight="bold"
              textAlign="center"
              mt={4}
              bg="white"
            >
              Redeem Rewards
            </Heading>
            {rewards.length > 0 ? (
              <Stack p={4} w="full" align="center">
                {rewards.map((reward) => (
                  <Box
                    key={reward.id}
                    p={3}
                    bg="white"
                    borderRadius="xl"
                    w="full"
                    textAlign="center"
                    shadow="md"
                    _hover={{ borderColor: "#B4EBE6", borderWidth: "1px" }}
                  >
                    <Text bg="white" p={3} mt={4}>
                      <strong>{reward.name}</strong> - {reward.cost} coins
                    </Text>
                    <Button
                      px={4}
                      py={2}
                      borderRadius="md"
                      bg={kid.currency >= reward.cost ? "#80CBC4" : "gray.300"}
                      color={kid.currency >= reward.cost ? "white" : "gray.500"}
                      _hover={{
                        bg:
                          kid.currency >= reward.cost ? "#6AC0B8" : "gray.300",
                      }}
                      onClick={() => redeemReward(reward)}
                      disabled={kid.currency < reward.cost || loading}
                    >
                      {loading ? "Processing..." : "Redeem"}
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text>No rewards available.</Text>
            )}
          </Stack>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default KidProfile;
