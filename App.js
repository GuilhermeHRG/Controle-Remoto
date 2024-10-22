import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const App = () => {
  const [ws, setWs] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [sensitivity, setSensitivity] = useState(5);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Conecta ao servidor WebSocket
    const socket = new WebSocket('ws://192.168.0.112:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('Conectado ao servidor WebSocket');
    };

    socket.onclose = () => {
      console.log('Desconectado do servidor WebSocket');
    };

    return () => {
      socket.close();
      clearInterval(intervalId);
    };
  }, []);

  const updateCursorPosition = (direction) => {
    setCursorPosition(prevPosition => {
      const { x, y } = prevPosition;
      let newX = x;
      let newY = y;

      if (direction === 'up') newY -= sensitivity;
      if (direction === 'down') newY += sensitivity;
      if (direction === 'left') newX -= sensitivity;
      if (direction === 'right') newX += sensitivity;

      // Envia os dados do cursor ao servidor WebSocket
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'move', x: newX, y: newY }));
      }

      return { x: newX, y: newY };
    });
  };

  const simulateClick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const clickMessage = JSON.stringify({ action: 'click' });
      console.log('Enviando mensagem de clique:', clickMessage);
      ws.send(clickMessage);
    } else {
      console.log('WebSocket não está aberto. Estado:', ws.readyState);
    }
  };

  const handleClick = () => {
    simulateClick();
  };

  const handlePressIn = (direction) => {
    if (intervalId) clearInterval(intervalId);
    const id = setInterval(() => updateCursorPosition(direction), 50);
    setIntervalId(id);
  };

  const handlePressOut = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleSensitivityChange = (value) => {
    setSensitivity(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle Remoto para Mouse</Text>
      <Text style={styles.text}>Posição do Cursor:</Text>
      <Text style={styles.positionText}>x: {cursorPosition.x.toFixed(2)}</Text>
      <Text style={styles.positionText}>y: {cursorPosition.y.toFixed(2)}</Text>

      <View style={styles.joystickContainer}>
        <TouchableOpacity
          style={[styles.button, styles.directionButton]}
          onPressIn={() => handlePressIn('up')}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Cima</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.directionButton]}
            onPressIn={() => handlePressIn('left')}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Esquerda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.clickButton]}
            onPress={handleClick}
          >
            <Text style={styles.buttonText}>Clique</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.directionButton]}
            onPressIn={() => handlePressIn('right')}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Direita</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.directionButton]}
          onPressIn={() => handlePressIn('down')}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Baixo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sensitivityContainer}>
        <Text style={styles.sensitivityText}>Ajustar Sensibilidade: {sensitivity}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={sensitivity}
          onValueChange={handleSensitivityChange}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#007BFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 18,
    color: '#555',
  },
  positionText: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
  joystickContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    width: 95,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: 10,
    margin: 10,
    padding: 2,
    elevation: 3, 
    shadowColor: '#555', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2,
    shadowRadius: 3, 
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
  },
  sensitivityContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  sensitivityText: {
    fontSize: 18,
    color: '#555',
  },
  slider: {
    width: '100%', 
    height: 40,
    
  },
  directionButton: {
    backgroundColor: '#202224', 
  },
  clickButton: {
    backgroundColor: '#555', 
  },
});

export default App;
