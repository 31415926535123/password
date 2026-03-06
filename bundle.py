def convertHtmlToSingleFile(htmlPath):
    import re, os
    with open(htmlPath, 'r', encoding='utf-8') as f:
        html = f.read()
    def replaceScript(m):
        src = m.group(1)
        if not src: return m.group(0)
        jsPath = os.path.join(os.path.dirname(htmlPath), src)
        try:
            with open(jsPath, 'r', encoding='utf-8') as jf:
                jsContent = jf.read()
            return f'<script>\n{jsContent}\n</script>'
        except:
            return m.group(0)
    newHtml = re.sub(r'<script\s+src="([^"]*)"\s*></script>', replaceScript, html)
    with open(htmlPath, 'w', encoding='utf-8') as f:
        f.write(newHtml)
convertHtmlToSingleFile('single.html')