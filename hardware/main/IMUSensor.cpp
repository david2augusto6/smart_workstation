#include "IMUSensor.h"

IMUSensor::IMUSensor(int sdaPin, int sclPin) : _sdaPin(sdaPin), _sclPin(sclPin) {}

bool IMUSensor::begin() {
    Wire.begin(_sdaPin, _sclPin);

    if (!_mpu.begin()){
        return false;
    }

    _mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
    _mpu.setGyroRange(MPU6050_RANGE_250_DEG);
    _mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
    return true;
}

float IMUSensor::getPitchAngle(){
    sensors_event_t a, g, temp;
    _mpu.getEvent(&a, &g, &temp);

    float pitch = atan2(a.acceleration.y, sqrt(a.acceleration.x * a.acceleration.x + a.acceleration.z * a.acceleration.z)) * (180 / PI);
    return pitch;
}

