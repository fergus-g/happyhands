import React from "react";
import {
  Button,
  Card,
  Heading,
  Stack,
  Box,
  Image,
  HStack,
  IconButton,
  useBreakpointValue,
  Text,
  Container,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";
import {
  FaStar,
  FaPenSquare,
  FaMousePointer,
  FaRegSmile,
  FaRegStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [slider, setSlider] = React.useState<Slider | null>(null);
  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  const cards = [
    {
      title: "Sarah Michaels",
      text: "This app has made chores fun! My kids love earning points, and we've had fewer arguments about screen time. It's a win-win!",
      image:
        "https://media.istockphoto.com/id/1325578537/photo/happy-indian-mother-having-fun-with-her-daughter-outdoor-family-and-love-concept-focus-on-mum.jpg?s=2048x2048&w=is&k=20&c=n1oZfFbGfu9PtHNxOO0NaDro16Cl8dUG-1Hkks0DhFc=",
    },
    {
      title: "James Ryan",
      text: "I love how my kids are now excited to complete their tasks. They plan their rewards and even suggest new ones. Great app!",
      image:
        "https://media.istockphoto.com/id/1968410965/photo/portrait-of-a-happy-little-girl-having-breakfast-with-her-mother-and-father-at-home.jpg?s=2048x2048&w=is&k=20&c=VO3ZRirGTRn505xJL6LOKJerE8UYhoKIUeZGm_48QQA=",
    },
    {
      title: "Emily Tomas",
      text: "Our weekend trips feel more rewarding because our kids earn them! They take ownership, and we all enjoy the experience together.",
      image:
        "https://media.istockphoto.com/id/1460965686/photo/seeing-your-daughter-happy-is-a-remarkable-feeling.jpg?s=2048x2048&w=is&k=20&c=wFhZctR4l_K9obCz16oXfcG3embCZa75Qb9qlv1KxQE=",
    },
  ];

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

        <Box
          position={"relative"}
          height={"600px"}
          width={"80%"}
          overflow={"hidden"}
          margin="auto"
          borderRadius="10px"
        >
          {/* CSS files for react-slick */}
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          {/* Left Icon */}
          <IconButton
            aria-label="left-arrow"
            variant="ghost"
            position="absolute"
            left={side}
            top={top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            onClick={() => slider?.slickPrev()}
          >
            <BiLeftArrowAlt size="40px" />
          </IconButton>
          {/* Right Icon */}
          <IconButton
            aria-label="right-arrow"
            variant="ghost"
            position="absolute"
            right={side}
            top={top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            onClick={() => slider?.slickNext()}
          >
            <BiRightArrowAlt size="40px" />
          </IconButton>
          {/* Slider */}
          <Slider {...settings} ref={(slider) => setSlider(slider)}>
            {cards.map((card, index) => (
              <Box
                key={index}
                height={"6xl"}
                position="relative"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundImage={`url(${card.image})`}
              >
                {/* This is the block you need to change, to customize the caption */}
                <Container
                  size="container.lg"
                  height="600px"
                  position="relative"
                  display="flex"
                  justifyContent="center"
                >
                  <Stack
                    spacing={6}
                    w={"full"}
                    maxW={"lg"}
                    position="absolute"
                    top="50%"
                    transform="translate(0, -50%)"
                    backgroundColor="rgba(255, 255, 255, 0.5)"
                    padding="10px"
                    borderRadius="10px"
                  >
                    <Heading
                      fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                      marginBottom="10px"
                    >
                      {card.title}
                    </Heading>
                    <Text fontSize={{ base: "md", lg: "lg" }} color="GrayText">
                      {card.text}
                    </Text>
                  </Stack>
                </Container>
              </Box>
            ))}
          </Slider>
        </Box>
      </Stack>
    </>
  );
};

export default LandingPage;
