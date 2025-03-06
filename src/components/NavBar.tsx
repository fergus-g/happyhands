import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { Box, Button, HStack, Stack } from "@chakra-ui/react";

interface Kid {
  id: number;
  name: string;
}

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [kids, setKids] = useState<Kid[]>([]);

  useEffect(() => {
    const fetchKids = async () => {
      if (!user) return;

      try {
        // ✅ Step 1: Get parent ID
        const { data: parentData, error: parentError } = await supabase
          .from("soc_final_parents")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        if (parentError) return;

        const parentId = parentData.id;

        // ✅ Step 2: Get only kids belonging to this parent
        const { data: kidsData, error: kidsError } = await supabase
          .from("soc_final_kids")
          .select("id, name")
          .eq("parent_id", parentId);

        if (kidsError) return;

        setKids(kidsData || []);
      } catch (error) {
        console.error("Error fetching kids:", error);
      }
    };

    fetchKids();
  }, [user]);

  const handleKidSelection = (kidId: number) => {
    navigate(`/kid/${kidId}`);
  };

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <HStack
      p={8}
      backgroundColor={"#80CBC4"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      width="100vw"
      height="100px"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {" "}
      {/* Left: Navigation Links */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          backgroundColor={"purple"}
          onClick={() => navigate("/Dashboard")}
          fontFamily="poppins"
          _hover={{ backgroundColor: "indigo" }}
        >
          Dashboard
        </Button>
        <Button
          backgroundColor={"purple"}
          onClick={() => navigate("/Tasks")}
          fontFamily="poppins"
          _hover={{ backgroundColor: "indigo" }}
        >
          Tasks
        </Button>
        <Button
          backgroundColor={"purple"}
          onClick={() => navigate("/Rewards")}
          fontFamily="poppins"
          _hover={{ backgroundColor: "indigo" }}
        >
          Rewards
        </Button>
        <Button
          backgroundColor={"purple"}
          onClick={() => navigate("/Parent")}
          fontFamily="poppins"
          _hover={{ backgroundColor: "indigo" }}
        >
          Profile
        </Button>

        {/* ✅ Kid Profile Dropdown
        {kids.length > 0 && (
          <li>
            <select
              className="text-black p-2 rounded"
              onChange={(e) => handleKidSelection(parseInt(e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>
                Select Child Profile
              </option>
              {kids.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name}
                </option>
              ))}
            </select>
          </li>
        )} */}
      </Box>
      {/* Right: Auth Controls */}
      <div className="flex space-x-4">
        {!user ? (
          <>
            <Button
              backgroundColor={"purple"}
              onClick={() => navigate("/Login")}
              fontFamily="poppins"
              _hover={{ backgroundColor: "indigo" }}
            >
              Login
            </Button>
            <Button
              backgroundColor={"purple"}
              onClick={() => navigate("/Sign Up")}
              fontFamily="poppins"
              _hover={{ backgroundColor: "indigo" }}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-100">Welcome, {user.id}</span>
            <Button
              backgroundColor={"purple"}
              onClick={() => handleLogout()}
              fontFamily="poppins"
              _hover={{ backgroundColor: "indigo" }}
            >
              Log Out
            </Button>
          </>
        )}
      </div>
    </HStack>
  );
};

export default NavBar;
