import re
with open('sitemap.xml', 'r') as f:
    content = f.read()

def fix_loc(match):
    url = match.group(1)
    if 'money-engine/output/' in url:
        return match.group(0)
    new_url = url.replace('liuliangrukou/', 'liuliangrukou/money-engine/output/')
    return '<loc>' + new_url + '</loc>'

fixed = re.sub(r'<loc>(.*?)</loc>', fix_loc, content)
with open('sitemap.xml', 'w') as f:
    f.write(fixed)
print('Fixed sitemap URLs')
