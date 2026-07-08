import os
import re
import json

def find_key_recursive(d, target_key):
    """
    Recursively check if a key exists in a nested dictionary
    """
    if target_key in d:
        return d[target_key]
    for k, v in d.items():
        if isinstance(v, dict):
            found = find_key_recursive(v, target_key)
            if found is not None:
                return found
    return None

def update_key_recursive(d, target_key, new_value):
    """
    Recursively find a key and update its value in place
    """
    if target_key in d:
        d[target_key] = new_value
        return True
    for k, v in d.items():
        if isinstance(v, dict):
            if update_key_recursive(v, target_key, new_value):
                return True
    return False

def run_translation_validation():
    dict_path = r"d:\antigravity\ym-laboratory\data\translation_dictionary.json"
    html_path = r"d:\antigravity\ym-laboratory\index.html"
    
    # 1. Load Translation Dictionary
    if not os.path.exists(dict_path):
        print(f"[ERROR] Dictionary file not found at: {dict_path}")
        return
        
    with open(dict_path, "r", encoding="utf-8") as f:
        try:
            translations = json.load(f)
        except Exception as e:
            print(f"[ERROR] JSON Decode Error in dictionary: {e}")
            return
            
    # 2. Extract translation keys and titles from HTML
    print("[1/3] Parsing index.html for translation hooks...")
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    # Pattern to find data-i18n="key"
    i18n_keys = re.findall(r'data-i18n="([^"]+)"', html_content)
    # Pattern to find data-i18n-placeholder="key"
    placeholder_keys = re.findall(r'data-i18n-placeholder="([^"]+)"', html_content)
    # Pattern to find data-i18n-title="key"
    title_keys = re.findall(r'data-i18n-title="([^"]+)"', html_content)
    
    all_hooked_keys = set(i18n_keys + placeholder_keys + title_keys)
    print(f" -> Found {len(all_hooked_keys)} unique translation keys hooked in HTML.")
    
    # 3. Detect untranslated or missing keys using nested lookup
    missing_keys = []
    already_existing_keys = []
    
    for key in all_hooked_keys:
        # Check in the entire nested dictionary structure
        existing_val = find_key_recursive(translations, key)
        if existing_val is None:
            missing_keys.append(key)
        else:
            already_existing_keys.append((key, existing_val))
            
    print(f"[2/3] Checking missing keys (nested aware). Found {len(missing_keys)} truly unregistered keys.")
    
    # 4. Correct any flat-level duplicate keys that override nested keys
    # If a key exists both at the root level and inside a nested category, 
    # we should clean up the root level duplicate to avoid overriding valid nested translations.
    cleaned_count = 0
    for root_key in list(translations.keys()):
        # skip meta and category containers
        if root_key == "meta" or root_key.startswith("category_"):
            continue
        
        # Check if this key also exists inside any category container
        for cat_key in list(translations.keys()):
            if cat_key.startswith("category_") and isinstance(translations[cat_key], dict):
                if root_key in translations[cat_key]:
                    # Duplicate found at root level! Let's delete the root level flat override.
                    del translations[root_key]
                    cleaned_count += 1
                    break
                    
    if cleaned_count > 0:
        print(f" -> Cleaned up {cleaned_count} duplicate root-level override keys.")
        
    # 5. Auto-register truly missing keys to root level
    if missing_keys:
        print(" -> Auto-registering truly missing keys to dictionary...")
        for key in missing_keys:
            en_val = key
            if "프로필" in key or "Leads" in key:
                en_val = "Profiles (Leads)"
            elif "공급원" in key or "Sources" in key:
                en_val = "Supply Sources"
            elif "제안 피드" in key or "Suggestions" in key:
                en_val = "B2C Suggestions"
            elif "마케팅" in key or "Campaigns" in key:
                en_val = "AI Campaigns"
                
            translations[key] = {
                "ko": key,
                "en": en_val,
                "ja": key,
                "ar": key
            }
            
        # Write back dictionary
        with open(dict_path, "w", encoding="utf-8") as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
        print(f" -> Successfully synchronized and saved {len(missing_keys)} keys into {dict_path}")
    elif cleaned_count > 0:
        # Save because we cleaned up root duplicates
        with open(dict_path, "w", encoding="utf-8") as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
        print(" -> Saved translation dictionary after cleaning duplicates.")
    else:
        print(" -> Perfect! No missing translation keys in the dictionary.")
        
    # 6. Static code scanner: check for raw Korean strings in HTML that do not have data-i18n
    print("[3/3] Scanning index.html for hardcoded Korean strings without data-i18n...")
    raw_ko_matches = re.finditer(r'>\s*([가-힣\s&(),./🌿🦠🥗🧬🎓📧💬📱🍂🍵🎁]+)\s*<', html_content)
    
    potential_leaks = []
    for match in raw_ko_matches:
        text = match.group(1).strip()
        if not text:
            continue
        if re.match(r'^[0-9\s\-,.:()]+$', text):
            continue
        start_idx = max(0, match.start() - 150)
        snippet = html_content[start_idx:match.start()]
        if "data-i18n" not in snippet and "data-i18n-placeholder" not in snippet:
            if "<script" not in snippet and "<!--" not in snippet:
                potential_leaks.append((text, match.start()))
                
    unique_leaks = list(set([leak[0] for leak in potential_leaks]))
    standard_excludes = ["원", "명", "건", "일반", "전문가", "웰빙 회원", "일반 체질", "전신 건강 관리"]
    unique_leaks = [l for l in unique_leaks if l not in standard_excludes and len(l) > 1]
    
    if unique_leaks:
        print(f" -> Warning: Found {len(unique_leaks)} potentially hardcoded Korean strings:")
        for leak in unique_leaks[:10]:
            print(f"    - '{leak}'")
    else:
        print(" -> Perfect! No raw Korean leaks detected in HTML.")

if __name__ == "__main__":
    run_translation_validation()
