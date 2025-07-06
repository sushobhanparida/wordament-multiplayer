# Solo Play Test Guide

## How to Test Solo Play

1. **Start the servers**:
   - Backend: `cd backend && npm start`
   - Frontend: `npm start`

2. **Test Solo Play Flow**:
   - Open http://localhost:3000
   - Enter a player name (e.g., "TestPlayer")
   - Click the "Play Solo" button (orange button)
   - You should be immediately taken to the game page
   - The game should start automatically with a 4x4 board
   - You should see the theme and target word displayed

3. **Expected Behavior**:
   - Solo games start immediately without waiting for other players
   - The game board should be visible and interactive
   - You can click/drag to form words
   - The timer should count down from 1 minute
   - After the timer expires, you should see round results
   - Click "Ready for Next Round" to continue
   - After 3 rounds, the game should end and show final results

## Debug Information

Check the browser console and backend terminal for these log messages:

### Frontend Console:
- "Starting solo play for player: [name]"
- "Room created: [data]"
- "Starting solo game for room: [roomCode]"
- "Solo game started successfully"
- "Game started event received: [data]"
- "Setting gameData to: [data]"

### Backend Terminal:
- "Room creation requested by [name] (solo) with 3 rounds"
- "Room [roomCode] created by [name] (solo mode)"
- "Game start requested for room [roomCode]"
- "Game started in room [roomCode]"
- "GameManager: Game started in room [roomCode] with theme: [theme], target: [word], isSolo: true"

## Common Issues and Solutions

1. **Game doesn't start**: Check if both servers are running and connected
2. **No game board**: Verify that gameData is being set correctly in the console
3. **Timer not working**: Check if startTime and endTime are properly set
4. **Round transitions**: Verify that playerReady events are being handled correctly

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify socket connection status
4. Try refreshing the page and testing again
5. Check that all files have been saved and servers restarted 