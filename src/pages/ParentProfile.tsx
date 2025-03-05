import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Parent } from "../types/database";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Box, Heading, Text, Image, Stack } from "@chakra-ui/react";

const ParentProfile: React.FC = () => {
  const [parent, setParent] = useState<Parent | null>(null);

  useEffect(() => {
    const fetchParent = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        console.error("User not authenticated", userError);
        return;
      }

      const userEmail = user.user.email;

      const { data, error } = await supabase
        .from("soc_final_parents")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle();

      if (error) {
        console.error(error);
      } else {
        setParent(data);
      }
    };

    fetchParent();
  }, []);

  if (!parent) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <Box
        w="100vw"
        h="100vh"
        bg="blue.100"
        p={6}
        display="flex"
        flexDirection="column"
        alignItems="center" // Centers horizontally
        justifyContent="flex-start" // Moves content closer to the top
      >
        <Heading as="h1" size="xl" fontWeight="bold" mb={4} bg="cream">
          Parent Profile
        </Heading>

        <Stack
          align="center"
          justify="center"
          mt={10}
          bg="blue.200"
          p={4}
          borderRadius="md"
        >
          <Image
            src="https://treemily.com/wp-content/uploads/2024/07/Despicable-Me-Felonius-Gru-1024x552.jpg"
            boxSize="150px"
            borderRadius="full"
            fit="cover"
            alt="Picture of Gru"
          />
          <Text fontSize="lg" bg="transparent">
            <Text as="span" fontWeight="bold">
              Name:
            </Text>{" "}
            {parent.name}
          </Text>
          <Text fontSize="lg" bg="transparent">
            <Text as="span" fontWeight="bold">
              Email:
            </Text>{" "}
            {parent.email}
          </Text>
        </Stack>
      </Box>
    </ProtectedRoute>
  );
};

export default ParentProfile;
