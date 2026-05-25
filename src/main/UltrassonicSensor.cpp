#include "UltrassonicSensor.h"

UltrassonicSensor::UltrassonicSensor(int trigPin, int echoPin, long timeoutUs) {
    _trigPin = trigPin;
    _echoPin = echoPin;
    _timeoutUs = timeoutUs;
}

void UltrassonicSensor::begin() {
    pinMode(_trigPin, OUTPUT);
    pinMode(_echoPin, INPUT);
    digitalWrite(_trigPin, LOW);
}

float UltrassonicSensor::readDistanceCm() {
    // Gera um pulso limpo de 10 microssegundos no Trigger
    digitalWrite(_trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(_trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(_trigPin, LOW);

    // Mede a duração do pulso de retorno no Echo
    long duration = pulseIn(_echoPin, HIGH, _timeoutUs);
    
    if (duration == 0) {
        return -1.0; 
    }

    // Calcula a distância baseada na velocidade do som
    return (duration * 0.0343) / 2.0;
}