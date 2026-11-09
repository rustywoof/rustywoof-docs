use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use regex::Regex;
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct ScanConfig {
    #[serde(rename = "customRules")]
    custom_rules: Option<Vec<Rule>>,
}

#[derive(Deserialize)]
pub struct Rule {
    name: String,
    pattern: String,
}

#[derive(Serialize)]
pub struct ScanResult {
    #[serde(rename = "ruleName")]
    rule_name: String,
    #[serde(rename = "isEntropyValid")]
    is_entropy_valid: bool,
}

fn calculate_entropy(s: &str) -> f64 {
    let len = s.len() as f64;
    if len == 0.0 { return 0.0; }
    let mut freqs = HashMap::new();
    for c in s.chars() {
        *freqs.entry(c).or_insert(0) += 1;
    }
    let mut entropy = 0.0;
    for &count in freqs.values() {
        let p = (count as f64) / len;
        entropy -= p * p.log2();
    }
    entropy
}

#[wasm_bindgen(js_name = executeScanWasm)]
pub fn execute_scan_wasm(text: &str, config_val: JsValue) -> Result<JsValue, JsValue> {
    let config: ScanConfig = serde_wasm_bindgen::from_value(config_val)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    let mut results = Vec::new();

    if let Some(rules) = config.custom_rules {
        for rule in rules {
            if let Ok(re) = Regex::new(&rule.pattern) {
                for mat in re.find_iter(text) {
                    let entropy = calculate_entropy(mat.as_str());
                    results.push(ScanResult {
                        rule_name: rule.name.clone(),
                        is_entropy_valid: entropy > 3.0,
                    });
                }
            }
        }
    }

    serde_wasm_bindgen::to_value(&results)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
