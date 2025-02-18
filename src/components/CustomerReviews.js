import React from "react"
import { Typography, Box, Avatar, Rating, Container } from "@mui/material"
import { Carousel } from "react-bootstrap"
import { motion } from "framer-motion"
import "bootstrap/dist/css/bootstrap.min.css" // Ensure Bootstrap's CSS is included

const reviews = [
  {
    id: 1,
    name: "Kusuma Shetty",
    rating: 5,
    comment: "Sleek design and unbeatable protection!",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Pranavi Gupta.",
    rating: 5,
    comment: "The customization options are amazing!",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Kamal Roy.",
    rating: 5,
    comment: "Premium quality at a great price.",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
]

function CustomerReviews() {
  return (
    <Box sx={{ py: 12, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{
            color: "primary.main",
            mb: 8,
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
            fontWeight: "bold",
          }}
        >
          Customer Experiences
        </Typography>
        <Carousel
          indicators={true}
          interval={5000}
          controls={true}
          nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
          prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
          slide={true}
          fade={true}
        >
          {reviews.map((review) => (
            <Carousel.Item key={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center p-4"
              >
                <Avatar
                  alt={review.name}
                  src={review.avatar}
                  sx={{
                    width: { xs: 120, sm: 150, md: 180 },
                    height: { xs: 120, sm: 150, md: 180 },
                    margin: "0 auto",
                    mb: 4,
                    border: "4px solid",
                    borderColor: "primary.main",
                  }}
                />
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  {review.name}
                </Typography>
                <Rating
                  value={review.rating}
                  readOnly
                  sx={{
                    my: 3,
                    fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mt: 3,
                    mb: 5,
                    color: "text.secondary",
                    fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                    fontStyle: "italic",
                    maxWidth: "80%",
                    margin: "0 auto",
                    paddingBottom: "20px"
                  }}
                >
                  "{review.comment}"
                </Typography>
              </motion.div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </Box>
  )
}

export default CustomerReviews

