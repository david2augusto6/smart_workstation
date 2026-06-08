#include "AlertManager.h"

AlertManager::AlertManager(int redPin, int greenPin, int bluePin, int buzzerPin) {
    _redPin = redPin;
    _greenPin = greenPin;
    _bluePin = bluePin;
    _buzzerPin = buzzerPin;
    _state = ALERT_OK;
    _stateStart = 0;
    _pulseStart = 0;
    _blinkStart = 0;
    _criticalPulseIndex = 0;
    _buzzerOn = false;
    _warningBeepDone = false;
    _criticalBeepActive = false;
    _ledOn = false;
}

void AlertManager::begin() {
    pinMode(_redPin, OUTPUT);
    pinMode(_greenPin, OUTPUT);
    pinMode(_bluePin, OUTPUT);
    pinMode(_buzzerPin, OUTPUT);

    setColor(0, 0, 0);
    stopBuzzer();
}

void AlertManager::update(float distanceCm) {
    unsigned long now = millis();

    if (distanceCm >= 0 && distanceCm < kDistanceThresholdCm) {
        if (_state == ALERT_OK) {
            enterState(ALERT_ALERTA);
        }

        unsigned long elapsed = now - _stateStart;
        if (_state == ALERT_ALERTA && elapsed >= kWarningDurationMs) {
            enterState(ALERT_CRITICO);
        } else if (_state == ALERT_CRITICO && elapsed >= (kWarningDurationMs + kCriticalDurationMs)) {
            enterState(ALERT_ALERTA);
        }
    } else {
        if (_state != ALERT_OK) {
            enterState(ALERT_OK);
        }
    }

    updateBuzzer();
    updateLED();
}

const char* AlertManager::getState() const {
    switch (_state) {
        case ALERT_ALERTA:
            return "ALERTA";
        case ALERT_CRITICO:
            return "CRÍTICO";
        default:
            return "OK";
    }
}

void AlertManager::enterState(AlertState nextState) {
    _state = nextState;
    _stateStart = millis();
    _pulseStart = _stateStart;
    _blinkStart = _stateStart;
    _buzzerOn = false;
    _warningBeepDone = false;
    _criticalBeepActive = false;
    _criticalPulseIndex = 0;
    _ledOn = false;

    switch (_state) {
        case ALERT_ALERTA:
            _warningBeepDone = false;
            setBuzzer(true);
            break;

        case ALERT_CRITICO:
            _criticalBeepActive = true;
            _criticalPulseIndex = 0;
            setBuzzer(true);
            break;

        default:
            setColor(0, 0, 0);
            stopBuzzer();
            break;
    }
}

void AlertManager::setColor(uint8_t redValue, uint8_t greenValue, uint8_t blueValue) {
    digitalWrite(_redPin, redValue > 0 ? HIGH : LOW);
    digitalWrite(_greenPin, greenValue > 0 ? HIGH : LOW);
    digitalWrite(_bluePin, blueValue > 0 ? HIGH : LOW);
}

void AlertManager::stopBuzzer() {
    setBuzzer(false);
}

void AlertManager::setBuzzer(bool enabled) {
    digitalWrite(_buzzerPin, enabled ? HIGH : LOW);
    _buzzerOn = enabled;
}

void AlertManager::updateBuzzer() {
    unsigned long now = millis();

    if (_state == ALERT_ALERTA) {
        if (!_warningBeepDone) {
            if (_buzzerOn && now - _pulseStart >= kBuzzerPulseMs) {
                setBuzzer(false);
                _warningBeepDone = true;
            }
        }
        return;
    }

    if (_state == ALERT_CRITICO && _criticalBeepActive) {
        if (_criticalPulseIndex >= kCriticalPulseCount) {
            setBuzzer(false);
            _criticalBeepActive = false;
            return;
        }

        if (_buzzerOn && now - _pulseStart >= kBuzzerPulseMs) {
            setBuzzer(false);
            _pulseStart = now;
        } else if (!_buzzerOn && now - _pulseStart >= kCriticalPulsePauseMs) {
            _criticalPulseIndex++;
            if (_criticalPulseIndex < kCriticalPulseCount) {
                setBuzzer(true);
                _pulseStart = now;
            } else {
                setBuzzer(false);
                _criticalBeepActive = false;
            }
        }
        return;
    }

    stopBuzzer();
}

void AlertManager::updateLED() {
    unsigned long now = millis();

    if (_state == ALERT_OK) {
        setColor(0, 0, 0);
        return;
    }

    unsigned long blinkElapsed = now - _blinkStart;
    if (blinkElapsed >= kBlinkIntervalMs) {
        _blinkStart = now;
        _ledOn = !_ledOn;
    }

    if (_state == ALERT_ALERTA) {
        if (_ledOn) {
            setColor(255, 200, 0);  // amarelo
        } else {
            setColor(0, 0, 0);  // apagado
        }
    } else if (_state == ALERT_CRITICO) {
        if (_ledOn) {
            setColor(255, 0, 0);  // vermelho
        } else {
            setColor(0, 0, 0);  // apagado
        }
    }
}
