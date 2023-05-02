import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Listing from "../components/Listing";
import StripeCheckout from "react-stripe-checkout";

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;
const Wrapper = styled.div``;
const Title = styled.h1`
  font-weight: 500;
  text-align: center;
`;

const Top = styled.div`
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton1 = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  background-color: white;
  color: black;
  border: 2px solid black;

  &:hover {
    background-color: black;
    color: white;
    border: 2px solid black;
  }
  ${mobile({ flex: 1, fontSize: "12px" })}
`;

const Button = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  background-color: black;
  color: white;
  border: 2px solid black;

  &:hover {
    background-color: white;
    color: black;
    border: 2px solid black;
  }
  ${mobile({ flex: 1, fontSize: "12px" })}
`;

const Bottom = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
  margin: 20px 0;
`;

const WonListings = () => {
  const token = useSelector((state) => state.token);
  const wonListings = useSelector((state) => state.wonListings);
  const navigate = useNavigate();

  let wonListingsBid = [];
  let checkout = 0;

  const bidsArray = wonListings.map((listing) => Number(listing.bid));
  console.log(bidsArray);

  bidsArray.forEach((bid) => wonListingsBid.push(bid));

  console.log(wonListingsBid);

  console.log(wonListingsBid.length);

  if (wonListingsBid.length > 1) {
    checkout = wonListingsBid.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
  } else {
    checkout = wonListingsBid[0];
  }
  console.log(checkout);

  const [stripeToken, setStripeToken] = useState(null);

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      const response = await fetch(`http://localhost:3001/checkout/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        tokenId: stripeToken.id,
        amount: checkout * 100,
      });
      const data = await response.json();
      navigate("/success", {
        state: {
          stripeData: data,
        },
      });
    };
    stripeToken && makeRequest();
  }, [stripeToken, checkout, token, navigate]);
  return (
    <Container>
      <Navbar />

      <Wrapper>
        <Title>MY WON AUCTIONS</Title>
        <Top>
          <TopButton1 onClick={() => navigate("/")}>
            VIEW MORE AUCTIONS
          </TopButton1>
          <StripeCheckout
            name="LiveAuction"
            image="https://c8.alamy.com/comp/WA0XJP/vector-logo-for-bidding-and-auctions-WA0XJP.jpg"
            billingAddress
            shippingAddress
            description={`Your total is $${checkout}`}
            amount={checkout * 100}
            token={onToken}
            stripeKey={KEY}
          >
            <Button>CHECKOUT NOW</Button>
          </StripeCheckout>
        </Top>

        <Bottom>
          {wonListings.map((listing) => (
            <Listing listing={listing} key={listing._id} />
          ))}
        </Bottom>
      </Wrapper>
      <Hr />
      <Footer />
    </Container>
  );
};

export default WonListings;
