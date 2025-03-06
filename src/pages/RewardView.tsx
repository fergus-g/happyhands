import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Reward } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Box, Field, Input, Heading } from "@chakra-ui/react";

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
  const handleReward = () => {
    //
  };
  return (
    <ProtectedRoute>
      <Heading>Reward Dashboard</Heading>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        px={4}
        bg="#80CBC4"
      >
        {/* <Box p={12} borderWidth="1px" shadow="lg" borderRadius="xl" maxW="md" w="full" bg="white">
              <Heading style={{ fontSize: "1.875rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem" }}>Login</Heading> */}

        <div className="p-6">
          {/* <Heading >
            Reward Dashboard
          </Heading> */}

          {/* ------------------------ Reward Creation Form ---------------------*/}
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold">Create Reward</h2>
            <form onSubmit={handleReward} className="w-full">
              <Field.Root>
                <Field.Label>
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="Reward name"
                  variant="subtle"
                  type="text"
                  shadow="md"
                  bg="white"
                  value={rewardName}
                  _hover={{ borderColor: "#B4EBE6", borderWidth: "1px" }}
                  onChange={(e) => setRewardName(e.target.value)}
                  required
                />
              </Field.Root>

              <input
                type="text"
                placeholder="Reward Name"
                className="w-full p-2 border rounded mb-2"
                value={rewardName}
                onChange={(e) => setRewardName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Cost in Coins"
                className="w-full p-2 border rounded mb-2"
                value={rewardCost}
                min="1"
                onChange={(e) => setRewardCost(parseInt(e.target.value, 10))}
                required
              />

              <button
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition"
                onClick={createReward}
                disabled={loading}
              >
                {loading ? "Adding..." : "Create Reward"}
              </button>
            </form>
          </div>

          {/* --------------------- Edit Reward Form -----------------------------------*/}
          {editingReward && (
            <div className="bg-gray-200 p-4 rounded-md mb-4">
              <h2 className="text-xl font-semibold">Edit Reward</h2>

              <input
                type="text"
                placeholder="Reward Name"
                className="w-full p-2 border rounded mb-2"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Cost in Coins"
                className="w-full p-2 border rounded mb-2"
                value={editedCost}
                min="1"
                onChange={(e) => setEditedCost(parseInt(e.target.value, 10))}
                required
              />

              <button
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition"
                onClick={editReward}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Reward"}
              </button>

              <button
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600 transition"
                onClick={() => setEditingReward(null)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* --------------------- Reward List ---------------------------------*/}
          {rewards.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold">Available Rewards</h2>
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-3 bg-gray-100 rounded-md mb-2"
                >
                  <p>
                    <strong>{reward.name}</strong>
                  </p>
                  <p>Cost: {reward.cost} coins</p>

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition"
                    onClick={() => {
                      setEditingReward(reward);
                      setEditedName(reward.name);
                      setEditedCost(reward.cost);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={() => deleteReward(reward.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No rewards available.</p>
          )}
        </div>
      </Box>
    </ProtectedRoute>
  );
};

export default RewardView;
