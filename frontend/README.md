# **Multiplayer Tic-Tac-Toe**

A real-time multiplayer Tic-Tac-Toe game built using **React**, **Node.js**, **Express**, and **Socket.io**.

## **Features**
- Play Tic-Tac-Toe with friends in real-time  
- Room-based multiplayer system  
- Instant updates using WebSockets  
- Tracks player turns and declares winners or draws  

## **Setup Guide**

### **1. Clone the Repository**
```bash
git clone https://github.com/siddharthaasal/multiplayer-tic-tac-toe.git
cd multiplayer-tic-tac-toe
```

### **2. Start the Frontend**
```bash
cd frontend/
npm install
npm start
```
> The React app will start on `http://localhost:3000`

### **3. Start the Backend**
```bash
cd ..
cd backend/
npm install
node --watch server.js
```
> The server will run on `http://localhost:3001`

## **How to Play**
1. One player **creates a room**.  
2. The second player **joins the room** using the same room ID.  
3. Players take turns clicking on the grid.  
4. The first to align **three marks** in a row, column, or diagonal **wins**.  
5. If all cells are filled without a winner, the game results in a **draw**.

## **Tech Stack**
- **Frontend:** React, Socket.io-client  
- **Backend:** Node.js, Express, Socket.io  

## **Future Improvements**
- Add player names  
- Improve UI/UX   

