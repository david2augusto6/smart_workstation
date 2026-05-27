#include "UltrassonicSensor.h"

// TRIG - D5; ECHO - D18
UltrassonicSensor sensorCervical(5, 18); 

void setup() {
    Serial.begin(115200);
    sensorCervical.begin();
}

void loop() {
    float dist = sensorCervical.readDistanceCm();
    Serial.println(dist);
    delay(500);
}

