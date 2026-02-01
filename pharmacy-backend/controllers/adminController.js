import User from "../models/User.js";

// Create pharmacist
export const createPharmacist = async (req, res) => {
  try {
    console.log('📝 Creating pharmacist with data:', req.body);
    const { name, email, phone, license } = req.body;
    
    // Check if pharmacist already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Pharmacist already exists:', email);
      return res.status(400).json({ message: "Pharmacist with this email already exists" });
    }
    
    // Create new pharmacist with common password
    const pharmacist = new User({
      name,
      email,
      password: "pharmacist123", // Common password for all pharmacists
      role: "pharmacist",
      phone,
      license
    });
    
    console.log('💾 Saving pharmacist to database...');
    await pharmacist.save();
    console.log('✅ Pharmacist saved successfully:', pharmacist._id);
    
    res.status(201).json({ 
      message: "Pharmacist created successfully",
      pharmacist: {
        id: pharmacist._id,
        name: pharmacist.name,
        email: pharmacist.email,
        phone: pharmacist.phone,
        license: pharmacist.license,
        role: pharmacist.role
      }
    });
  } catch (error) {
    console.error('❌ Create pharmacist error:', error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get all pharmacists
export const getAllPharmacists = async (req, res) => {
  try {
    console.log('📋 Fetching all pharmacists...');
    const pharmacists = await User.find({ role: "pharmacist" }).select('-password');
    console.log('✅ Found pharmacists:', pharmacists.length);
    res.json(pharmacists);
  } catch (error) {
    console.error('❌ Get pharmacists error:', error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Update pharmacist
export const updatePharmacist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, license } = req.body;
    
    const pharmacist = await User.findByIdAndUpdate(
      id,
      { name, email, phone, license },
      { new: true }
    ).select('-password');
    
    if (!pharmacist) {
      return res.status(404).json({ message: "Pharmacist not found" });
    }
    
    res.json({ message: "Pharmacist updated successfully", pharmacist });
  } catch (error) {
    console.error('Update pharmacist error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete pharmacist
export const deletePharmacist = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pharmacist = await User.findByIdAndDelete(id);
    if (!pharmacist) {
      return res.status(404).json({ message: "Pharmacist not found" });
    }
    
    res.json({ message: "Pharmacist deleted successfully" });
  } catch (error) {
    console.error('Delete pharmacist error:', error);
    res.status(500).json({ message: "Server error" });
  }
};