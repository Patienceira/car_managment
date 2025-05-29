import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pssms',
});

db.connect((err) => {
  if (err) {
    console.log('Connection failed:', err);
  } else {
    console.log('Connected to PSSMS database');
  }
});

/////////////////////////// PARKING SLOT /////////////////////////////

// Create Parking Slot
app.post('/parkingslots', (req, res) => {
  const { SlotNumber, IsAvailable } = req.body;

  if (!SlotNumber || IsAvailable == null) {
    return res.status(400).json({ error: 'Provide SlotNumber and IsAvailable' });
  }

  const sql = `INSERT INTO parkingslot (SlotNumber, IsAvailable) VALUES (?, ?)`;
  db.query(sql, [SlotNumber, IsAvailable], (err, result) => {
    if (err) {
      console.error('Error inserting parking slot:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Parking slot created', id: result.insertId });
  });
});

// Get All Parking Slots
app.get('/parkingslots', (req, res) => {
  db.query('SELECT * FROM parkingslot', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Update Parking Slot
app.put('/parkingslots/:id', (req, res) => {
  const { SlotNumber, IsAvailable } = req.body;

  if (!SlotNumber || IsAvailable == null) {
    return res.status(400).json({ error: 'Provide SlotNumber and IsAvailable' });
  }

  const sql = `UPDATE parkingslot SET SlotNumber=?, IsAvailable=? WHERE id=?`;
  db.query(sql, [SlotNumber, IsAvailable, req.params.id], (err) => {
    if (err) {
      console.error('Error updating parking slot:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Parking slot updated' });
  });
});

// Delete Parking Slot
app.delete('/parkingslots/:id', (req, res) => {
  db.query('DELETE FROM parkingslot WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Parking slot deleted' });
  });
});

/////////////////////////// CAR /////////////////////////////

// Register Car
app.post('/cars', (req, res) => {
  const { PlateNumber, OwnerName } = req.body;

  if (!PlateNumber || !OwnerName) {
    return res.status(400).json({ error: 'Provide PlateNumber and OwnerName' });
  }

  const sql = `INSERT INTO car (PlateNumber, OwnerName) VALUES (?, ?)`;
  db.query(sql, [PlateNumber, OwnerName], (err, result) => {
    if (err) {
      console.error('Error inserting car:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Car registered', id: result.insertId });
  });
});

// Get All Cars
app.get('/cars', (req, res) => {
  db.query('SELECT * FROM car', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete Car
app.delete('/cars/:id', (req, res) => {
  db.query('DELETE FROM car WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Car deleted' });
  });
});

/////////////////////////// PARKING RECORD /////////////////////////////

// Create Parking Record
app.post('/parkingrecords', (req, res) => {
  const { CarID, SlotID, EntryTime } = req.body;

  if (!CarID || !SlotID || !EntryTime) {
    return res.status(400).json({ error: 'Provide CarID, SlotID, and EntryTime' });
  }

  const sql = `INSERT INTO parkingrecord (CarID, SlotID, EntryTime) VALUES (?, ?, ?)`;
  db.query(sql, [CarID, SlotID, EntryTime], (err, result) => {
    if (err) {
      console.error('Error inserting parking record:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Parking record created', id: result.insertId });
  });
});

// Exit Parking - Update Exit Time
app.put('/parkingrecords/:id/exit', (req, res) => {
  const { ExitTime } = req.body;

  if (!ExitTime) {
    return res.status(400).json({ error: 'Provide ExitTime' });
  }

  const sql = `UPDATE parkingrecord SET ExitTime = ? WHERE id = ?`;
  db.query(sql, [ExitTime, req.params.id], (err) => {
    if (err) {
      console.error('Error updating exit time:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Exit time updated' });
  });
});

// Get All Parking Records
app.get('/parkingrecords', (req, res) => {
  db.query('SELECT * FROM parkingrecord', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/////////////////////////// PAYMENT /////////////////////////////

// Create Payment Record
app.post('/payments', (req, res) => {
  const { ParkingRecordID, Amount, PaymentDate } = req.body;

  if (!ParkingRecordID || Amount == null || !PaymentDate) {
    return res.status(400).json({ error: 'Provide ParkingRecordID, Amount and PaymentDate' });
  }

  const sql = `INSERT INTO payment (ParkingRecordID, Amount, PaymentDate) VALUES (?, ?, ?)`;
  db.query(sql, [ParkingRecordID, Amount, PaymentDate], (err, result) => {
    if (err) {
      console.error('Error inserting payment:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Payment recorded', id: result.insertId });
  });
});

// Get All Payments
app.get('/payments', (req, res) => {
  db.query('SELECT * FROM payment', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//////////////////Report ////////////////////



///LOGIN 




app.post('/login', (req, res) => {
    const sql = "SELECT * FROM admin WHERE name = ? AND password = ?";
    const { name, password } = req.body;

    db.query(sql, [name, password], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json(result);
    });
});

app.post('/register', (req, res) => {
    const sql = "INSERT INTO admin (name,password)  VALUES(?,?)";
    const { name, password } = req.body;

    db.query(sql, [name, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        return res.status(200).json(result);
    });
});




app.get('/report', (req, res) => {
  const sql = `
   SELECT
  (SELECT COUNT(DISTINCT CarID) FROM parkingrecord) AS totalCars,
  (SELECT COUNT(DISTINCT SlotID) FROM parkingrecord) AS totalSlots,
  (SELECT COUNT(*) FROM parkingrecord WHERE ExitTime IS NULL) AS activeParking,
  (SELECT IFNULL(SUM(Amount), 0) FROM payment) AS totalPayments;

  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching report:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]); // Return the single row with the report data
  });
});









/////////////////////////// START SERVER /////////////////////////////

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`PSSMS API running on http://localhost:${PORT}`);
});
