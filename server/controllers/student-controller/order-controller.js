// const paypal = require("../../helpers/paypal");
const { default: axios } = require("axios");
const Course = require("../../models/Course");
const Order = require("../../models/Order");
const StudentCourses = require("../../models/StudentCourses");

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_ID}`
  ).toString("base64");

  const response = await axios.post(
    `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    }
  );
  // return response.data;
  // console.log(response.data);
  return response.data.access_token;
};

const createOrder = async (req, res) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve PayPal access token.",
    });
  }
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentStatus,
      paymentMethod,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseId,
      courseImage,
      courseTitle,
      coursePricing,
    } = req.body;
    const totalPrice = Number(coursePricing).toFixed(2);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course pricing." });
    }
    const create_payment_json = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPrice,
          },
          description: courseTitle,
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
    };

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      create_payment_json,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approveLink = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;
    if (!approveLink) {
      return res
        .status(500)
        .json({ success: false, message: "PayPal approval link not found." });
    }
    const newlyCreatedOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentStatus,
      paymentMethod,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseId,
      courseImage,
      courseTitle,
      coursePricing,
    });
    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      data: { approveUrl: approveLink, orderId: newlyCreatedOrder._id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve PayPal access token.",
    });
  }
  try {
    const { paymentId, payerId, orderId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;
    await order.save();

    // update studentCourse manage
    const isStudentHaveAnyCourse = await StudentCourses.findOne({
      userId: order.userId,
    });
    if (isStudentHaveAnyCourse) {
      isStudentHaveAnyCourse.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });
      await isStudentHaveAnyCourse.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });
      await newStudentCourses.save();
    }

    // add or update student in  course schema
    const course = await Course.findById(order.courseId);
    course.students.push({
      studentId: order.userId,
      studentName: order.userName,
      studentEmail: order.userEmail,
      paidAmount: order.coursePricing,
    });
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Order Confirmed",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occured." });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
