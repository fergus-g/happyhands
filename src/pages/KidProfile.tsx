import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Box, Heading, Text, Button, Stack, Avatar, AvatarGroup } from '@chakra-ui/react';
import { Kid, Reward } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";

const KidProfile: React.FC = () => {
  const { id } = useParams();
  const [kid, setKid] = useState<Kid | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKidAndRewards = async () => {
      if (!id) return;

      const kidId = parseInt(id, 10);
      if (isNaN(kidId)) return;

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

      const { data: rewardsData, error: rewardsError } = await supabase
        .from("soc_final_rewards")
        .select("*")
        .eq("parent_id", parentId);

      if (rewardsError) {
        console.error("Error fetching rewards:", rewardsError);
        return;
      }

      setRewards(rewardsData);
    };

    fetchKidAndRewards();
  }, [id]);

  const redeemReward = async (reward: Reward) => {
    if (!kid || kid.currency < reward.cost) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("soc_final_kids")
        .update({ currency: kid.currency - reward.cost })
        .eq("id", kid.id);

      if (updateError) throw new Error("Error updating currency");

      const { error: redeemError } = await supabase
        .from("soc_final_redeemed_rewards")
        .insert([
          { kid_id: kid.id, reward_id: reward.id, parent_id: kid.parent_id },
        ]);

      if (redeemError) throw new Error("Error adding redeemed reward");

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
    <Box display="flex" justifyContent="center" alignItems="center" p={6} shadow="md" bg="#80CBC4">
      <Box display="flex" w="50%" justifyContent="center" alignItems="center" p={3} shadow="md" bg="white" borderRadius="xl">
      <Stack p={6} align="center" w="full" bg="white">
        {/* Kid's Profile Header */}
        <Heading as="h2" size="2xl" fontWeight="bold" bg="white" p={6} borderRadius="md" w="full" textAlign="center">
          {kid.name}'s Profile
          <AvatarGroup  p={4}>
            <Avatar.Root>
              <Avatar.Fallback name={`${kid.name}'s Avatar`}/>
              <Avatar.Image src="https://i.ytimg.com/vi/eXwZMAz9Vh8/maxresdefault.jpg"/>
            </Avatar.Root>
          </AvatarGroup>
        </Heading>
  
        {/* Coins Info */}
        <Text textAlign="center" bg="white">
          <strong>Coins:</strong> {kid.currency}
        </Text>
  
        {/* ------------------ Reward Redemption Section --------------------*/}
        <Heading as="h3" size="md" fontWeight="bold" textAlign="center" mt={4} bg="white">
          Redeem Rewards
        </Heading>
  
        {rewards.length > 0 ? (
          <Stack p={4} w="full" align="center" >
            {rewards.map((reward) => (
              <Box key={reward.id} p={3} bg="white" borderRadius="xl"
                w="full" textAlign="center" shadow="md" _hover={{ borderColor: "#B4EBE6", borderWidth: "1px" }}>
                <Text  bg="white" p={3} mt={4}>
                  <strong>{reward.name}</strong> - {reward.cost} coins
                </Text>
                <Button
                  px={4}
                  py={2}
                  borderRadius="md"
                  bg={kid.currency >= reward.cost ? "#80CBC4" : "gray.300"}
                  color={kid.currency >= reward.cost ? "white" : "gray.500"}
                  _hover={{
                    bg: kid.currency >= reward.cost ? "#6AC0B8" : "gray.300",
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
    )}
   
  

//     <ProtectedRoute>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">{kid.name}'s Profile</h1>
//         <p>
//           <strong>Coins:</strong> {kid.currency}
//         </p>

//         {/* ------------------ Reward Redemption Section --------------------*/}
//         <h2 className="text-xl font-bold mt-4">Redeem Rewards</h2>
//         {rewards.length > 0 ? (
//           <ul>
//             {rewards.map((reward) => (
//               <li key={reward.id} className="p-3 bg-gray-100 rounded-md mb-2">
//                 <p>
//                   <strong>{reward.name}</strong> - {reward.cost} coins
//                 </p>
//                 <button
//                   className={`px-4 py-2 rounded ${
//                     kid.currency >= reward.cost
//                       ? "bg-blue-500 text-white hover:bg-blue-600"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   }`}
//                   onClick={() => redeemReward(reward)}
//                   disabled={kid.currency < reward.cost || loading}
//                 >
//                   {loading ? "Processing..." : "Redeem"}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No rewards available.</p>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// };

export default KidProfile;
