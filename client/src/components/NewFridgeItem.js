import React, { useState, useEffect } from "react";
import "../containers/home/style.css";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import pkg00 from "../media/pkg00.jpeg";
import pkg01 from "../media/pkg01.png";
import pkg02 from "../media/pkg02.jpeg";
import pkg03 from "../media/pkg03.jpeg";
import pkg04 from "../media/pkg04.jpeg";
import pkg05 from "../media/pkg05.jpeg";
import pkg06 from "../media/pkg06.jpeg";
import pkg07 from "../media/pkg07.jpeg";
import pkg08 from "../media/pkg08.jpeg";

import { Row, Col, Button } from "react-materialize";
import convert from "convert-units";
import { fraction } from "mathjs";
import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../state/actions";
import { bindActionCreators } from "redux";

const NewFridgeItem = (props) => {
  const userData = useSelector((state) => state.userData);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { setShoppingListData } = bindActionCreators(ActionCreators, dispatch);

  const { modal, setModal, itemKey, setItemKey, fridge, setFridge } = props;
  const [shoppingList, setShoppingList] = useState(userData.shoppingList);
  const [quantity, setQuantity] = useState("");
  const [ounces, setOunces] = useState("");
  const [grams, setGrams] = useState("");
  const [pounds, setPounds] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    setShoppingListData(shoppingList);
    console.log("updated");
  }, [shoppingList]);

  const convertUnits = (e) => {
    let amount = e.target.value;

    if (/[a-z]/i.test(amount)) {
      return;
    }
    switch (e.target.name) {
      case "quantity":
        if (amount > 100) {
          return;
        }
        setQuantity(amount);
        setUnit("");
        setOunces("");
        setGrams("");
        setPounds("");
        return;
      case "ounces":
        if (amount > 400) {
          return;
        }
        setOunces(amount);
        setQuantity("");
        setGrams(convert(amount).from("oz").to("g").toFixed(2));
        setPounds(convert(amount).from("oz").to("lb").toFixed(2));
        setUnit("oz");
        return;
      case "grams":
        if (amount > 11339.8) {
          return;
        }
        setGrams(amount);
        setQuantity("");
        setOunces(convert(amount).from("g").to("oz").toFixed(2));
        setPounds(convert(amount).from("g").to("lb").toFixed(2));
        setUnit("g");
        return;
      case "pounds":
        if (amount > 25) {
          return;
        }
        setPounds(amount);
        setQuantity("");
        setOunces(convert(amount).from("lb").to("oz").toFixed(2));
        setGrams(convert(amount).from("lb").to("g").toFixed(2));
        setUnit("lb");
        return;
      default:
        return;
    }
  };
  const addItem = () => {
    if (!quantity && !ounces && !pounds && !grams) {
      setFridge((prevFridge) => [
        ...prevFridge,
        {
          ...shoppingList[itemKey],
        },
      ]);
    } else if (
      fridge.some((item) => item.name === shoppingList[itemKey].name)
    ) {
      fridge.map((item, i) => {
        if (item.name === shoppingList[itemKey].name) {
          setFridge((prevFridge) => [
            ...prevFridge,
            (prevFridge[i] = {
              ...prevFridge[i],
              quantity: prevFridge[i].quantity + parseFloat(quantity || ounces),
            }),
          ]);
        }
      });
    } else {
      setFridge((prevFridge) => [
        ...prevFridge,
        {
          ...shoppingList[itemKey],
          quantity: parseFloat(quantity || ounces),
        },
      ]);
    }
    setShoppingList((prevList) => {
      prevList.splice(itemKey, 1);
      return [...prevList];
    });
    setModal(!modal);
    setItemKey("");
    setQuantity("");
    setPounds("");
    setUnit("");
    setGrams("");
    setOunces("");
  };

  // const { isAuthenticated, userId } = auth;
  // const newList = [...shoppingList];
  // const newIngredient = newList[itemKey];
  // const newAgain = newIngredient;
  // console.log(shoppingList[itemKey].quantity);
  // console.log(quantity, ounces);
  // let newQuantity = parseFloat(quantity || ounces);
  // if (!newFridge.some((e) => e.name === newAgain.name)) {
  //   newAgain.quantity = newQuantity; // /* check to see if ingredient already exisit in the groceryList*/
  //   newFridge.push(newAgain);
  //   console.log(shoppingList[itemKey].quantity);
  //   // setFridge((prevFridge) => [...prevFridge, shoppingList]

  //   // }

  //   //   newFridge);
  // setModal(!modal);
  // } else {
  //   setFridge((prevState) => {
  //     prevState.map((el) =>
  //       el.name === newIngredientName
  //         ? {
  //             ...el,
  //             quantity: el.quantity + newQuantity,
  //           }
  //         : el
  //     );
  //     console.log(shoppingList[itemKey]);
  //   });
  //   setModal(!modal);
  // }

  //   if (isAuthenticated) {
  //     axios
  //       .post("/api/fridgeItem", {
  //         newIngredient: newIngredient,
  //         userId: userId,
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         alert("Failed to create: " + err.message);
  //       });
  //   }
  // } else {
  //   console.log("before:", fridge);

  // }

  return (
    <Modal isOpen={modal} toggle={() => setModal(!modal)} id="new-fridge-item">
      {/* <ModalHeader
        className="teal darken-4 white-text"
        style={{ padding: "0.5rem 1rem" }}
        toggle={() => setModal(!modal)}
      >
        How much do you have?
      </ModalHeader> */}
      <div className="newItem-header">How much do you have?</div>
      <div className="newItem-text">
        Unsure of how much of an ingredient you have? Choose one of the
        packaging formats provided below. Optionally, You can choose to input
        the amount or quantity in directly.
      </div>
      <h5 className="newItem-title">
        {itemKey ? shoppingList[itemKey].name : null}{" "}
      </h5>
      <ModalBody>
        <Row className="newItem-row">
          <Col s={3} className="newItem-column">
            <Button
              value="15"
              name="ounces"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg01} className="newItem-image" />
              15 oz
            </Button>
          </Col>
          <Col s={3} className="newItem-column">
            <Button
              value="5"
              name="pounds"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg02} className="newItem-image" />5 lb
            </Button>
          </Col>
          <Col s={3} className="newItem-column">
            <Button
              value="20"
              name="ounces"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg03} className="newItem-image" />
              20 oz
            </Button>
          </Col>
          <Col s={3} className="newItem-column">
            <Button
              value="16"
              name="ounces"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg07} className="newItem-image" />
              16 oz
            </Button>
          </Col>
        </Row>
        <Row className="newItem-row">
          <Col s={3} className="newItem-column">
            <Button
              value="32"
              name="ounces"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg04} className="newItem-image" />
              <div>32 oz</div>
            </Button>
          </Col>
          <Col s={3} className="newItem-column">
            <Button
              value="16"
              name="ounces"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg05} className="newItem-image" />
              16 oz
            </Button>
          </Col>
          <Col s={3} className="newItem-column">
            <Button
              value="15"
              name="ounces"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg06} className="newItem-image" />
              10 oz
            </Button>
          </Col>
          <Col s={3} className="newItem-column">
            <Button
              value="3"
              name="pounds"
              onClick={convertUnits}
              className="newItem-button"
            >
              <img src={pkg08} className="newItem-image" />3 lb
            </Button>
          </Col>
        </Row>
      </ModalBody>

      {/* <Row className="newItem-amt-row">
        <Col className="newItem-amt-col pb-3">
          <div className="newItem-amt">
            <input type="text" />
          </div>
          <div className="newItem-amt">
            <input type="text" className="" />
          </div>
          <div className="newItem-amt">
            <input type="text" className="" />
          </div>
          <div className="newItem-amt">
            <input type="text" className="" />
          </div>
        </Col>
        <Col s={4} className="newItem-amt-col">
            <div className="newItem-amt">Quantity</div>{" "}
            <div className="newItem-amt"> oz</div>
            <div className="newItem-amt">  g</div>
            <div className="newItem-amt">lbs</div>
        </Col>
      </Row> */}
      <Row className="newItem-amt-row" style={{ width: "60%" }}>
        <div className="newItem-amt">
          <input
            type="text"
            name="quantity"
            value={quantity}
            onChange={convertUnits}
          />
        </div>
        <div className="newItem-amt">Quantity</div>{" "}
      </Row>
      <Row className="newItem-amt-row">
        <Col className="newItem-amt-col pb-3">
          <div className="newItem-amt">
            <input
              type="text"
              name="pounds"
              className=""
              value={pounds}
              onChange={convertUnits}
            />
          </div>
          <div className="newItem-amt">lbs</div>
        </Col>
        <Col className="newItem-amt-col pb-3">
          <div className="newItem-amt">
            <input
              type="text"
              name="ounces"
              className=""
              value={ounces}
              onChange={convertUnits}
            />
          </div>
          <div className="newItem-amt"> oz</div>
        </Col>
        <Col className="newItem-amt-col pb-3">
          <div className="newItem-amt">
            <input
              type="text"
              name="grams"
              className=""
              value={grams}
              onChange={convertUnits}
            />
          </div>
          <div className="newItem-amt"> g</div>
        </Col>
      </Row>

      <Button className="newItem-submit" onClick={addItem}>
        Add
      </Button>
    </Modal>
  );
};
export default NewFridgeItem;
