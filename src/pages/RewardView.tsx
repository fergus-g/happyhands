import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Reward } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";
import {
  Box,
  Input,
  Heading,
  Button,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";

const RewardView: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardName, setRewardName] = useState("");
  const [rewardCost, setRewardCost] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedCost, setEditedCost] = useState(1);

  useEffect(() => {
    const fetchRewards = async () => {
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

      const { data, error } = await supabase
        .from("soc_final_rewards")
        .select("*")
        .eq("parent_id", parentId);

      if (error) console.error(error);
      else setRewards(data);
    };

    fetchRewards();
  }, []);

  const createReward = async () => {
    if (!rewardName.trim() || rewardCost <= 0) return;

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

      const { error } = await supabase
        .from("soc_final_rewards")
        .insert([{ name: rewardName, cost: rewardCost, parent_id: parentId }]);

      if (error) throw new Error("Error creating reward");

      setRewardName("");
      setRewardCost(1);

      const { data: updatedRewards, error: fetchError } = await supabase
        .from("soc_final_rewards")
        .select("*")
        .eq("parent_id", parentId);

      if (fetchError) throw new Error("Error fetching rewards");
      setRewards(updatedRewards);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const editReward = async () => {
    if (!editingReward || !editedName.trim() || editedCost <= 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("soc_final_rewards")
        .update({ name: editedName, cost: editedCost })
        .eq("id", editingReward.id);

      if (error) throw new Error("Error updating reward");

      setEditingReward(null);
      setEditedName("");
      setEditedCost(1);

      const { data: updatedRewards, error: fetchError } = await supabase
        .from("soc_final_rewards")
        .select("*")
        .eq("parent_id", editingReward.parent_id);

      if (fetchError) throw new Error("Error fetching rewards");
      setRewards(updatedRewards);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const deleteReward = async (rewardId: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("soc_final_rewards")
        .delete()
        .eq("id", rewardId);

      if (error) throw new Error("Error deleting reward");

      setRewards((prev) => prev.filter((reward) => reward.id !== rewardId));
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <Box bg="#B2DFDB" p={4} rounded="md" mb={4} shadow="lg">
        <Heading
          mt={2}
          bg="purple.500"
          color="white"
          p={4}
          borderRadius="xl"
          shadow="md"
          fontSize="1.875rem"
          fontWeight="bold"
          textAlign="center"
          mb={8}
        >
          Rewards
        </Heading>

        <VStack gap={4} align="stretch">
          {/* ------------------------ Reward Creation Form ---------------------*/}
          <Box bg="gray.100" p={4} rounded="md" mb={4}>
            <Text fontSize="xl" fontWeight="semibold" mb={4}>
              Create Reward
            </Text>
            <Input
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              placeholder="Reward Name"
              mb={4}
              variant="outline"
            />

            <Input
              type="number"
              value={rewardCost}
              onChange={(e) => setRewardCost(Number(e.target.value))}
              min={1}
              placeholder="Reward Cost"
              mb={4}
              variant="outline"
            />

            <Button
              onClick={createReward}
              colorScheme="green"
              width="full"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" color="white" /> : "Create Reward"}
            </Button>
          </Box>

          {/* --------------------- Edit Reward Form -----------------------------------*/}
          {editingReward && (
            <Box bg="gray.100" p={4} rounded="md" mb={4}>
              <Text fontSize="xl" fontWeight="semibold" mb={4}>
                Edit Reward
              </Text>

              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Reward Name"
                mb={4}
                variant="outline"
              />

              <Input
                type="number"
                value={editedCost}
                onChange={(e) => setEditedCost(Number(e.target.value))}
                min={1}
                placeholder="Reward Cost"
                mb={4}
                variant="outline"
              />

              <Button
                onClick={editReward}
                colorScheme="green"
                width="full"
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Update Reward"
                )}
              </Button>

              <Button
                onClick={() => setEditingReward(null)}
                variant="outline"
                colorScheme="gray"
                width="full"
                mt={2}
              >
                Cancel
              </Button>
            </Box>
          )}

          {/* --------------------- Reward List ---------------------------------*/}
          {rewards.length > 0 ? (
            <Box>
              <Heading size="md" mb={4}>
                Available Rewards
              </Heading>
              {rewards.map((reward) => (
                <Box
                  key={reward.id}
                  bg="gray.100"
                  p={4}
                  rounded="md"
                  mb={4}
                  shadow="sm"
                >
                  <p>
                    <strong>{reward.name}</strong>
                  </p>
                  <p>Cost: {reward.cost} coins</p>

                  <Button
                    onClick={() => {
                      setEditingReward(reward);
                      setEditedName(reward.name);
                      setEditedCost(reward.cost);
                    }}
                    colorScheme="blue"
                    mr={2}
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => deleteReward(reward.id)}
                    colorScheme="red"
                  >
                    Delete
                  </Button>
                </Box>
              ))}
            </Box>
          ) : (
            <Text>No rewards available.</Text>
          )}
        </VStack>
      </Box>
    </ProtectedRoute>
  );
};

export default RewardView;
