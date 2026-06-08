#ifndef ULTRASSONIC_SENSOR_H
#define ULTRASSONIC_SENSOR_H

#include <Arduino.h>

class UltrassonicSensor {
private:
    int _trigPin;
    int _echoPin;
    long _timeoutUs;

public:
    UltrassonicSensor(int trigPin, int echoPin, long timeoutUs = 30000);
    void begin();
    float readDistanceCm();
};

#endif