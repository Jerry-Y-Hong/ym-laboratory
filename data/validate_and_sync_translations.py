import os
import re
import json

def run_translation_validation():
    dict_path = r"d:\antigravity\mfco-site\data\translation_dictionary.json"
    html_path = r"d:\antigravity\mfco-site\index.html"
    
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
    
    # 3. Detect untranslated or missing keys
    missing_keys = []
    for key in all_hooked_keys:
        if key not in translations:
            missing_keys.append(key)
            
    print(f"[2/3] Checking missing keys. Found {len(missing_keys)} unregistered keys.")
    
    # 4. Auto-generate stub entries for missing keys
    # To keep translations professional, we'll try basic English mapping or fallback
    if missing_keys:
        print(" -> Auto-registering missing keys to dictionary...")
        for key in missing_keys:
            # simple fallback mapping logic
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
        print(f" -> Successfully registered {len(missing_keys)} keys into {dict_path}")
    else:
        print(" -> Perfect! No missing translation keys in the dictionary.")
        
    # 5. Static code scanner: check for raw Korean strings in HTML that do not have data-i18n
    # We look for typical Korean text nodes: >Korean Text<
    print("[3/3] Scanning index.html for hardcoded Korean strings without data-i18n...")
    raw_ko_matches = re.finditer(r'>\s*([가-힣\s&(),./🌿🦠🥗🧬🎓📧💬📱🍂🍵🎁]+)\s*<', html_content)
    
    potential_leaks = []
    for match in raw_ko_matches:
        text = match.group(1).strip()
        if not text:
            continue
        # Skip purely numeric/special texts
        if re.match(r'^[0-9\s\-,.:()]+$', text):
            continue
        # Check if the surrounding element has data-i18n
        # We search a small snippet before the match
        start_idx = max(0, match.start() - 150)
        snippet = html_content[start_idx:match.start()]
        if "data-i18n" not in snippet and "data-i18n-placeholder" not in snippet:
            # Make sure it isn't script tags or comments
            if "<script" not in snippet and "<!--" not in snippet:
                potential_leaks.append((text, match.start()))
                
    # Filter unique leaks
    unique_leaks = list(set([leak[0] for leak in potential_leaks]))
    # Remove standard exceptions
    standard_excludes = ["원", "명", "건", "일반", "전문가", "웰빙 회원", "일반 체질", "전신 건강 관리"]
    unique_leaks = [l for l in unique_leaks if l not in standard_excludes and len(l) > 1]
    
    if unique_leaks:
        print(f" -> Warning: Found {len(unique_leaks)} potentially hardcoded Korean strings:")
        for leak in unique_leaks[:10]:
            print(f"    - '{leak}'")
        if len(unique_leaks) > 10:
            print(f"    - ... and {len(unique_leaks) - 10} more")
    else:
        print(" -> Perfect! No raw Korean leaks detected in HTML.")

if __name__ == "__main__":
    run_translation_validation()
