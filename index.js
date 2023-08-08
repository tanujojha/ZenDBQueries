// Find all the topics and tasks which are thought in the month of October.
// Query October Topics
const octoberTopics = await Topic.find({
    $expr: {
    $eq: [{ $month: '$dateTaught' }, 10] // 10 represents October
    }
});

// Query October Tasks
const octoberTasks = await Task.find({
    $expr: {
    $eq: [{ $month: '$dateAssigned' }, 10] // 10 represents October
    }
});


// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020.
const startDate = new Date('2020-10-15');
const endDate = new Date('2020-10-31');

const companyDrives = await Drive.find({
  date: {
    $gte: startDate,
    $lte: endDate
  }
});


// Find all the company drives and students who are appeared for the placement.
const drivesAndStudents = await CompanyDrive.find()
  .populate({
    path: 'appearedStudents',
    model: 'Student',
    match: { appearedForPlacement: true } // Assuming the field name is appearedForPlacement
  });


// Find the number of problems solved by the user in codekata
const userSchema = new mongoose.Schema({
  username: String,
  // other user properties...
});

const problemSolvedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  // other problem solved properties...
});

const User = mongoose.model('User', userSchema);
const ProblemSolved = mongoose.model('ProblemSolved', problemSolvedSchema);

app.get('/problems-solved/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const numberOfProblemsSolved = await ProblemSolved.countDocuments({ userId });
    res.json({ numberOfProblemsSolved });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Find all the mentors with who has the mentee's count more than 15
app.get('/mentors-with-many-mentees', async (req, res) => {
  try {
    const mentorsWithManyMentees = await Mentor.find({
      mentees: { $exists: true, $size: { $gt: 15 } }
    });
    res.json({ mentors: mentorsWithManyMentees });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
app.get('/users-absent-and-tasks-not-submitted', async (req, res) => {
  try {
    const absentUsers = await User.find({ status: 'absent' });
    const absentUserIds = absentUsers.map(user => user._id);

    const unsubmittedTasks = await Task.find({
      userId: { $in: absentUserIds },
      dateAssigned: {
        $gte: new Date('2020-10-15'),
        $lte: new Date('2020-10-31')
      },
      status: 'not submitted'
    });

    const count = unsubmittedTasks.length;
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});