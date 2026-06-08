#ifndef ALERT_MANAGER_H
#define ALERT_MANAGER_H

#include <Arduino.h>

enum AlertState {
    ALERT_OK,
    ALERT_ALERTA,
    ALERT_CRITICO
};

class AlertManager {
private:
    int _redPin;
    int _greenPin;
    int _bluePin;
    int _buzzerPin;

    AlertState _state;
    unsigned long _stateStart;
    unsigned long _pulseStart;
    unsigned long _blinkStart;
    int _criticalPulseIndex;
    bool _buzzerOn;
    bool _warningBeepDone;
    bool _criticalBeepActive;
    bool _ledOn;

    static const unsigned long kDistanceThresholdCm = 35;
    static const unsigned long kWarningDurationMs = 10000;
    static const unsigned long kCriticalDurationMs = 30000;
    static const unsigned long kBuzzerPulseMs = 50;
    static const unsigned long kCriticalPulsePauseMs = 500;
    static const unsigned long kBlinkIntervalMs = 300;
    static const int kCriticalPulseCount = 3;

public:
    AlertManager(int redPin, int greenPin, int bluePin, int buzzerPin);
    void begin();
    void update(float distanceCm);
    const char* getState() const;

private:
    void enterState(AlertState nextState);
    void setColor(uint8_t redValue, uint8_t greenValue, uint8_t blueValue);
    void stopBuzzer();
    void setBuzzer(bool enabled);
    void updateBuzzer();
    void updateLED();
};

#endif
