#ifndef IMU_SENSOR_H
#define IMU_SENSOR_H

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

class IMUSensor {
    private:
        Adafruit_MPU6050 _mpu;
        int _sdaPin;
        int _sclPin;
    
    public:
        IMUSensor(int sdaPin, int sclPin);

        bool begin();

        float getPitchAngle();
};

#endif