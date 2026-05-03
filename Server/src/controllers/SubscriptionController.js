import SubscriptionPlan from "../models/SubscriptionPlan.js";

// GET – כל המנויים
export const getSubscriptions = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET – מנוי בודד לפי id
export const getSubscriptionById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Subscription not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST – יצירת מנוי חדש (Admin בלבד)
export const createSubscription = async (req, res) => {
  const { name, price, includesDelivery } = req.body;
  try {
    const plan = new SubscriptionPlan({ name, price, includesDelivery });
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT – עדכון מנוי (Admin בלבד)
export const updateSubscription = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Subscription not found" });

    const { name, price, includesDelivery } = req.body;
    if (name !== undefined) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (includesDelivery !== undefined) plan.includesDelivery = includesDelivery;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE – מחיקת מנוי (Admin בלבד)
export const deleteSubscription = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Subscription not found" });

    await plan.remove();
    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
