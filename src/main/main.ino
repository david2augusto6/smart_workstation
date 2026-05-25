#include "UltrassonicSensor.h"

// Instanciação correta com dois 's'
UltrassonicSensor sensorCervical(5, 18); 

void setup() {
    Serial.begin(115200);
    sensorCervical.begin();
}

void loop() {
    float dist = sensorCervical.readDistanceCm();
    Serial.print(dist);
    delay(500);
}

