const fs = require('fs');
const path = require('path');

const files = [
  'src/extensions/HeroHeadline.tsx',
  'src/extensions/HeroSubheadline.tsx',
  'src/extensions/HeroBadge.tsx',
  'src/extensions/HeroButtonGroup.tsx',
  'src/extensions/HeroMedia.tsx',
  'src/extensions/ParagraphElement.tsx',
  'src/extensions/DividerElement.tsx',
  'src/extensions/SpacerElement.tsx',
  'src/extensions/IconElement.tsx',
  'src/extensions/ImageElement.tsx',
  'src/extensions/VideoElement.tsx'
];

const attributesSchema = `      marginTop: { 
        default: '0px',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-margin-top');
          if (!val) return '0px';
          try { return JSON.parse(val); } catch(e) { return val; }
        },
        renderHTML: attributes => ({ 'data-margin-top': typeof attributes.marginTop === 'object' ? JSON.stringify(attributes.marginTop) : attributes.marginTop })
      },
      marginBottom: { 
        default: '0px',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-margin-bottom');
          if (!val) return '0px';
          try { return JSON.parse(val); } catch(e) { return val; }
        },
        renderHTML: attributes => ({ 'data-margin-bottom': typeof attributes.marginBottom === 'object' ? JSON.stringify(attributes.marginBottom) : attributes.marginBottom })
      },
      zIndex: { 
        default: 'auto',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-z-index');
          if (!val) return 'auto';
          try { return JSON.parse(val); } catch(e) { return val; }
        },
        renderHTML: attributes => ({ 'data-z-index': typeof attributes.zIndex === 'object' ? JSON.stringify(attributes.zIndex) : attributes.zIndex })
      },
      padding: { 
        default: '0',
        keepAttributes: true,
        parseHTML: element => {
          const val = element.getAttribute('data-padding');
          if (!val) return '0';
          try { return JSON.parse(val); } catch(e) { return val; }
        },
        renderHTML: attributes => ({ 'data-padding': typeof attributes.padding === 'object' ? JSON.stringify(attributes.padding) : attributes.padding })
      }`;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(\`File not found: \${filePath}\`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Add Import
  if (!content.includes("import { useUIStore } from '../store/useUIStore';")) {
    content = content.replace(/import {[^}]+} from '@tiptap\/react';/, (match) => {
       return match + "\nimport { useUIStore } from '../store/useUIStore';";
    });
    // Fallback if the above doesn't match
    if (!content.includes("import { useUIStore } from '../store/useUIStore';")) {
        content = "import { useUIStore } from '../store/useUIStore';\n" + content;
    }
  }

  // 2. Update addAttributes
  const addAttributesMatch = content.match(/addAttributes\(\) \{\s+return \{([\s\S]+?)\s+\};\s+\}/);
  if (addAttributesMatch) {
    let existingAttrs = addAttributesMatch[1];
    // Remove existing definitions of the new attributes if they exist
    existingAttrs = existingAttrs.replace(/^\s+marginTop: \{[\s\S]+?\},?\s*$/gm, '');
    existingAttrs = existingAttrs.replace(/^\s+marginBottom: \{[\s\S]+?\},?\s*$/gm, '');
    existingAttrs = existingAttrs.replace(/^\s+zIndex: \{[\s\S]+?\},?\s*$/gm, '');
    existingAttrs = existingAttrs.replace(/^\s+padding: \{[\s\S]+?\},?\s*$/gm, '');
    
    // Ensure the last attribute has a comma
    existingAttrs = existingAttrs.trim();
    if (existingAttrs && !existingAttrs.endsWith(',')) {
      existingAttrs += ',';
    }
    
    const newAddAttributes = \`  addAttributes() {
    return {
\${existingAttrs}
\${attributesSchema}
    };
  }\`;
    content = content.replace(/addAttributes\(\) \{\s+return \{[\s\S]+?\}\s+\}/, newAddAttributes);
  }

  // 3. Update Component Logic
  // Find component function
  const componentMatch = content.match(/const (\w+Component) = \(props: any\) => \{([\s\S]+?)return \(/);
  if (componentMatch) {
    const componentName = componentMatch[1];
    let componentBody = componentMatch[2];
    
    // Add activeDevice
    if (!componentBody.includes('activeDevice')) {
        componentBody = "  const activeDevice = useUIStore(state => state.activeDevice);\n" + componentBody;
    }

    // Add resolution logic
    const resolutionLogic = \`
  const currentMarginTop = typeof marginTop === 'object' ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');
  const currentMarginBottom = typeof marginBottom === 'object' ? (marginBottom[activeDevice] || '0px') : (marginBottom || '0px');
  const currentZIndex = typeof zIndex === 'object' ? (zIndex[activeDevice] || 'auto') : (zIndex || 'auto');
  const currentPadding = typeof padding === 'object' ? (padding[activeDevice] || '0') : (padding || '0');
\`;
    
    if (!componentBody.includes('currentMarginTop')) {
        // Insert before return
        componentBody += resolutionLogic;
    }

    // Extract attributes from node.attrs
    componentBody = componentBody.replace(/const \{([\s\S]+?)\} = node\.attrs;/, (match, attrs) => {
        let attrList = attrs.split(',').map(a => a.trim());
        ['marginTop', 'marginBottom', 'zIndex', 'padding'].forEach(a => {
            if (!attrList.includes(a)) attrList.push(a);
        });
        return \`const { \${attrList.join(', ')} } = node.attrs;\`;
    });

    content = content.replace(/const (\w+Component) = \(props: any\) => \{[\s\S]+?return \(/, \`const \${componentName} = (props: any) => {\${componentBody}return (\`);
  }

  // 4. Update JSX (NodeViewWrapper and Tooltip)
  // Update NodeViewWrapper style and class
  content = content.replace(/<NodeViewWrapper([\s\S]+?)>/, (match, attrs) => {
    let newAttrs = attrs;
    
    // Update style
    if (newAttrs.includes('style={{')) {
        newAttrs = newAttrs.replace(/style=\{\{([\s\S]+?)\}\}/, (m, styleContent) => {
            let newStyle = styleContent.trim();
            if (newStyle && !newStyle.endsWith(',')) newStyle += ',';
            return \`style={{ \${newStyle} marginTop: currentMarginTop, marginBottom: currentMarginBottom, zIndex: currentZIndex === 'auto' ? undefined : currentZIndex }}\`;
        });
    } else {
        newAttrs += \` style={{ marginTop: currentMarginTop, marginBottom: currentMarginBottom, zIndex: currentZIndex === 'auto' ? undefined : currentZIndex }}\`;
    }

    return \`<NodeViewWrapper\${newAttrs}>\`;
  });

  // Update inner container padding if it has className with ring/hover
  // Actually, usually we apply padding to the element itself or its wrapper.
  // The instruction says "Apply padding as a Tailwind class (e.g. p-2 using p-${currentPadding})".
  // I'll apply it to the main content container inside NodeViewWrapper.
  
  content = content.replace(/className=\{cn\(([\s\S]+?)\)\}/g, (match, cnContent) => {
      if (!cnContent.includes('\`p-\${currentPadding}\`')) {
          let newCn = cnContent.trim();
          if (newCn && !newCn.endsWith(',')) newCn += ',';
          return \`className={cn(\${newCn} \\\`p-\\\${currentPadding}\\\`)}\`;
      }
      return match;
  });

  // 5. Update Tooltip Label
  // Search for the tooltip container (usually -top-10 or similar)
  content = content.replace(/className=\{cn\(\s+"absolute (-top-\d+|top-\d+)\s+right-0 flex flex-row-reverse items-center gap-1([\s\S]+?)\)\}/, (match, topPos, rest) => {
      return \`className={cn("absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-40", selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}\`;
  });

  // Update Trash Button
  content = content.replace(/<button[\s\S]+?onClick=\{handleDelete\}[\s\S]+?>([\s\S]+?)<\/button>/, (match, inner) => {
      return \`<button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Element"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>\`;
  });

  // Update Label Styling
  // Find the div that looks like a label
  content = content.replace(/<div[\s\S]+?onClick=\{[^}]+\}[\s\S]+?className="bg-indigo-600 text-\[?\d+px\]?[\s\S]+?>([\s\S]+?)<\/div>/, (match, labelText) => {
      return \`<div 
            onClick={() => { if (typeof props.getPos === 'function') props.editor.commands.setNodeSelection(props.getPos()); }}
            className="bg-indigo-600/80 backdrop-blur-md text-[8px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest cursor-pointer shadow-xl border border-white/20 italic"
          >
            \${labelText.trim()}
          </div>\`;
  });

  fs.writeFileSync(fullPath, content);
  console.log(\`Refactored \${filePath}\`);
});
