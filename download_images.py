import os
import re
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "public", "assets")
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

pattern = re.compile(r"Request to GET (/[^\s]+) on images\.squarespace-cdn\.com")

def process_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read(500)
        
        match = pattern.search(content)
        if not match:
            return (file_path, "SKIPPED", "No error pattern found")
        
        rel_path = match.group(1)
        url = f"https://images.squarespace-cdn.com{rel_path}"
        
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Referer": "https://www.lightscameralearn.org/"
            }
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
            if len(data) < 1000 and b"not allowed by policy" in data:
                return (file_path, "FAILED", "Still blocked by policy")
            
            with open(file_path, "wb") as f_out:
                f_out.write(data)
                
            return (file_path, "SUCCESS", f"{len(data)} bytes")
            
    except Exception as e:
        return (file_path, "ERROR", str(e))

def main():
    files_to_process = []
    for root, dirs, files in os.walk(ASSETS_DIR):
        for file in files:
            files_to_process.append(os.path.join(root, file))
            
    print(f"Found {len(files_to_process)} total files in {ASSETS_DIR}")
    
    success_count = 0
    fail_count = 0
    skip_count = 0
    
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(process_file, fp): fp for fp in files_to_process}
        for future in as_completed(futures):
            fp, status, msg = future.result()
            rel_name = os.path.relpath(fp, ASSETS_DIR)
            if status == "SUCCESS":
                success_count += 1
                if success_count % 20 == 0 or success_count == len(files_to_process):
                    print(f"[{success_count}/{len(files_to_process)}] Downloaded: {rel_name} ({msg})")
            elif status == "SKIPPED":
                skip_count += 1
            else:
                fail_count += 1
                print(f"FAILED: {rel_name} -> {msg}")
                
    print("\n===============================")
    print("Download complete!")
    print(f"Success: {success_count}")
    print(f"Skipped: {skip_count}")
    print(f"Failed:  {fail_count}")
    print("===============================")

if __name__ == "__main__":
    main()
