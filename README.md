# WYSIWYG-editor
A simple jQuery WYSIWYG editor based on the [Medium.com](https://medium.com) editor.

**Try it out:**
http://martijnvdb.com/demo/wysiwyg-editor/

## Quick install
Add the stylesheet to the `<head>` tag of your document.

    <link rel="stylesheet" type="text/css" href="css/mui-editor.css">

Add the following HTML to your document.

    <div class="mui-editor">
      <div class="mui-editor-content">
        ...
      </div>
    </div>

Now add the following scripts to the bottom of your document.

    <script src="js/jquery.min.js" type="text/javascript"></script>
    <script src="js/mui-editor.js" type="text/javascript"></script>

### Link Placeholder Text
To change the placeholder text from the link URL editing box, place `data-mui-editor-toolbar-link-placeholder="..."` in the `<div class="mui-editor">` tag. Replace `...` with your custom text.

**Example:**

    <div class="mui-editor" data-mui-editor-toolbar-link-placeholder="...">
