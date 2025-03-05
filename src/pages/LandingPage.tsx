import {
  Button,
  Card,
  Heading,
  Stack,
  Box,
  Image,
  HStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import {
  FaStar,
  FaPenSquare,
  FaMousePointer,
  FaRegSmile,
  FaRegStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Header */}
      <Stack
        p={8}
        backgroundColor={"#80CBC4"}
        dislay="flex"
        flexDirection="row"
        justifyContent="space-between"
        width="100vw"
        height="100px"
        position="sticky"
        top="0"
        zIndex="1000"
      >
        <Heading size="2xl" fontFamily="sans-serif">
          Happy Hands
        </Heading>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            backgroundColor={"purple"}
            onClick={() => navigate("/create-profile")}
          >
            Sign Up
          </Button>
          <Button backgroundColor={"purple"}>Download</Button>
          <Button backgroundColor={"purple"}>Features</Button>
          <Button backgroundColor={"purple"}>Testimonials</Button>
        </Box>
      </Stack>
      {/* Title Card */}
      <Stack gap="4" direction="row" wrap="wrap" width="100vw">
        <Card.Root
          width="100vw"
          variant={"elevated"}
          key={"elevated"}
          backgroundColor={"#B4EBE6"}
        >
          <Card.Body
            gap="2"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Stack
              justifyContent="center"
              flexDirection="column"
              display="flex"
            >
              <Card.Description
                color="purple"
                fontSize="50px"
                textShadow="2px 2px 5px rgba(0, 0, 0, 0.5)"
                sx={{
                  WebkitTextStroke: "1px black",
                }}
                alignSelf="center"
                textAlign="center"
              >
                The App to get Kids off Apps!
              </Card.Description>
              <Stack display="flex" flexDirection="row" justifyContent="center">
                <Button
                  backgroundColor={"purple"}
                  onClick={() => navigate("/create-profile")}
                >
                  Sign Up
                </Button>
                <Button
                  backgroundColor={"purple"}
                  onClick={() => navigate("/login")}
                  marginLeft="5px"
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
            <Image
              src="../../public/dusty.png"
              height="400px"
              width="400px"
              marginRight="200px"
            />
          </Card.Body>
          <Card.Footer justifyContent="flex-end"></Card.Footer>
        </Card.Root>
      </Stack>
      {/* Download */}

      <Stack
        gap="40"
        direction="row"
        wrap="wrap"
        justifyContent="center"
        marginTop="40px"
        width="100vw"
      >
        <Card.Root variant={"elevated"} key={"elevated"} width="800px">
          <Card.Body gap="2">
            <Card.Title mb="2" alignSelf="center">
              We are on the app store
            </Card.Title>
            <Card.Description alignSelf="center">
              <HStack paddingLeft="20px">
                <FaStar color="gold" size={24} />
                <FaStar color="gold" size={24} />
                <FaStar color="gold" size={24} />
                <FaStar color="gold" size={24} />
                <FaStar color="gold" size={24} />
              </HStack>
              Rating 4.75/5 from 200 Customers
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="flex-end" alignSelf="center">
            <Button
              as="a"
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="blackAlpha"
              variant="solid"
              size="lg"
            >
              <FontAwesomeIcon icon={faApple} />
              Download on the App Store
            </Button>
            <Button
              as="a"
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="blue"
              variant="solid"
              size="lg"
            >
              <FontAwesomeIcon icon={faGooglePlay} />
              Get it on Google Play
            </Button>
          </Card.Footer>
        </Card.Root>
        <Card.Root width="800px" variant={"elevated"} key={"elevated"}>
          <Card.Body gap="2" alignContent="center" justifyContent="center">
            <Card.Description fontSize="20px">
              Available for download from app stores, get ouit app for mobiles,
              desktops, tablets and more!
              <br />
              <br />
              Follow HappyHands blogs for regular updates!
            </Card.Description>
          </Card.Body>
        </Card.Root>
      </Stack>

      {/* About Us */}
      <Stack
        gap="4"
        direction="row"
        wrap="wrap"
        width="100vw"
        marginTop="100px"
      >
        <Card.Root
          width="100vw"
          variant={"elevated"}
          key={"elevated"}
          backgroundColor={"#B4EBE6"}
        >
          <Card.Body gap="2">
            <Card.Description
              color="purple"
              fontSize="50px"
              textAlign="center"
              textShadow="2px 2px 5px rgba(0, 0, 0, 0.5)"
              paddingBottom="100px"
              paddingTop="40px"
              sx={{
                WebkitTextStroke: "1px black",
              }}
            >
              Why choose Happy Hands?
            </Card.Description>
            <Stack flexDirection="row">
              <Card.Root
                width="25vw"
                variant={"elevated"}
                key={"elevated"}
                backgroundColor={"#80CBC4"}
                border="solid"
                borderColor={"#FFB433"}
              >
                <Card.Body
                  gap="2"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Card.Description
                    color="purple"
                    fontSize="50px"
                    textAlign="center"
                    textShadow="2px 2px 5px rgba(0, 0, 0, 0.5)"
                    sx={{
                      WebkitTextStroke: "1px black",
                    }}
                  >
                    Customisable
                  </Card.Description>

                  <FaPenSquare
                    style={{
                      color: "purple",
                      fontSize: "3rem",
                      margin: "20px",
                    }}
                  />
                  <Card.Description
                    color="black"
                    fontSize="25px"
                    textAlign="center"
                  >
                    Tailor tasks, rewards, and themes to suit your family's
                    needs.
                  </Card.Description>
                </Card.Body>

                <Card.Footer justifyContent="flex-end"></Card.Footer>
              </Card.Root>
              <Card.Root
                width="25vw"
                variant={"elevated"}
                key={"elevated"}
                backgroundColor={"#80CBC4"}
                border="solid"
                borderColor={"#FFB433"}
              >
                <Card.Body
                  gap="2"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Card.Description
                    color="purple"
                    fontSize="50px"
                    textAlign="center"
                    textShadow="2px 2px 5px rgba(0, 0, 0, 0.5)"
                    sx={{
                      WebkitTextStroke: "1px black",
                    }}
                  >
                    Interactive
                  </Card.Description>
                  <FaMousePointer
                    style={{
                      color: "purple",
                      fontSize: "3rem",
                      margin: "20px",
                    }}
                  />
                  <Card.Description
                    color="black"
                    fontSize="25px"
                    textAlign="center"
                  >
                    Kids stay engaged with interactive progress tracking and
                    rewards.
                  </Card.Description>
                </Card.Body>

                <Card.Footer justifyContent="flex-end"></Card.Footer>
              </Card.Root>
              <Card.Root
                width="25vw"
                variant={"elevated"}
                key={"elevated"}
                backgroundColor={"#80CBC4"}
                border="solid"
                borderColor={"#FFB433"}
              >
                <Card.Body
                  gap="2"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Card.Description
                    color="purple"
                    fontSize="50px"
                    textAlign="center"
                    textShadow="2px 2px 5px rgba(0, 0, 0, 0.5)"
                    sx={{
                      WebkitTextStroke: "1px black",
                    }}
                  >
                    Easy to Use
                  </Card.Description>

                  <FaRegSmile
                    style={{
                      color: "purple",
                      fontSize: "3rem",
                      margin: "20px",
                    }}
                  />
                  <Card.Description
                    color="black"
                    fontSize="25px"
                    textAlign="center"
                  >
                    A simple, intuitive interface makes managing tasks
                    effortless.
                  </Card.Description>
                </Card.Body>

                <Card.Footer justifyContent="flex-end"></Card.Footer>
              </Card.Root>
              <Card.Root
                width="25vw"
                variant={"elevated"}
                key={"elevated"}
                backgroundColor={"#80CBC4"}
                border="solid"
                borderColor={"#FFB433"}
              >
                <Card.Body
                  gap="2"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Card.Description
                    color="purple"
                    fontSize="50px"
                    textAlign="center"
                    textShadow="2px 2px 5px rgba(0, 0, 0, 0.5)"
                    sx={{
                      WebkitTextStroke: "1px black",
                    }}
                  >
                    Fun Features
                  </Card.Description>
                  <FaRegStar
                    style={{
                      color: "purple",
                      fontSize: "3rem",
                      margin: "20px",
                    }}
                  />
                  <Card.Description
                    color="black"
                    fontSize="25px"
                    textAlign="center"
                  >
                    Unlock achievements, collect badges, and enjoy playful
                    animations!
                  </Card.Description>
                </Card.Body>

                <Card.Footer justifyContent="flex-end"></Card.Footer>
              </Card.Root>
            </Stack>
          </Card.Body>

          <Card.Footer justifyContent="flex-end"></Card.Footer>
        </Card.Root>
      </Stack>

      <Stack height="1000px"></Stack>
    </>
  );
};

export default LandingPage;
