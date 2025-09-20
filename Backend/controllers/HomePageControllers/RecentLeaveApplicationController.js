const recentleaveapplication = async (req, res) => {
  try {
    const { EmployeeId } = req.body;

    if (!EmployeeId) {
      return res.status(400).json({ message: "EmployeeId is required" });
    }

    // Generate a random status
    const statuses = ["Approve", "Reject", "Pending"];

    // Generate 3 dummy leave applications for this employee
    const data = Array.from({ length: 3 }, (_, i) => ({
      EmployeeId,
      date: `20/09/2025`,
      message: `Random leave application ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));

    return res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { recentleaveapplication };
