import { onCLS, onINP, onLCP } from 'web-vitals';

const THRESHOLDS = {
  LCP: 2500, // ms
  INP: 200,  // ms (Interaction to Next Paint)
  CLS: 0.1,
};

function alertIfSlow(name, value) {
  if (
    (name === "LCP" && value > THRESHOLDS.LCP) ||
    (name === "INP" && value > THRESHOLDS.INP) ||
    (name === "CLS" && value > THRESHOLDS.CLS)
  ) {
    // eslint-disable-next-line no-alert
    alert(`${name} is high: ${name === "CLS" ? value : (value / 1000).toFixed(2) + "s"}`);
  }
}

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS((metric) => {
      onPerfEntry(metric);
      alertIfSlow('CLS', metric.value);
    });
    
    onINP((metric) => {
      onPerfEntry(metric);
      alertIfSlow('INP', metric.value);
    });
    
    onLCP((metric) => {
      onPerfEntry(metric);
      alertIfSlow('LCP', metric.value);
    });
  }
};

export default reportWebVitals;