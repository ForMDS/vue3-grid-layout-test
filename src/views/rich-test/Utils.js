/**
 * Copyright (c) 2018-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { watch } from 'vue';

const validEvents = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onContextMenu',
  'onCommentChange',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onInput',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid'
];

const isValidKey = (key) =>
  validEvents.map((event) => event.toLowerCase()).indexOf(key.toLowerCase()) !== -1;

const bindHandlers = (initEvent, listeners, editor) => {
  Object.keys(listeners)
    .filter(isValidKey)
    .forEach((key) => {
      const handler = listeners[key];
      if (typeof handler === 'function') {
        if (key === 'onInit') {
          handler(initEvent, editor);
        } else {
          editor.on(key.substring(2), (e) => handler(e, editor));
        }
      }
    });
};

const bindModelHandlers = (props, ctx, editor, modelValue) => {
  const modelEvents = props.modelEvents ? props.modelEvents : null;
  const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

  watch(modelValue, (val, prevVal) => {
    if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: props.outputFormat })) {
      editor.setContent(val);
    }
  });

  editor.on(normalizedEvents ? normalizedEvents : 'change input undo redo', () => {
    ctx.emit('update:modelValue', editor.getContent({ format: props.outputFormat }));
  });
};

const initEditor = (
  initEvent,
  props,
  ctx,
  editor,
  modelValue,
  content
) => {
  editor.setContent(content());
  if (ctx.attrs['onUpdate:modelValue']) {
    bindModelHandlers(props, ctx, editor, modelValue);
  }
  bindHandlers(initEvent, ctx.attrs, editor);
};

let unique = 0;

const uuid = (prefix) => {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + '_' + random + unique + String(time);
};

const isTextarea = (element) =>
  element !== null && element.tagName.toLowerCase() === 'textarea';

const normalizePluginArray = (plugins) => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return [];
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ');
};

const mergePlugins = (initPlugins, inputPlugins) =>
  normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));

const isDisabledOptionSupported = (editor) =>
  typeof editor.options.set === 'function' && editor.options.isRegistered('disabled');

export {
  bindHandlers,
  bindModelHandlers,
  initEditor,
  isValidKey,
  uuid,
  isTextarea,
  mergePlugins,
  isDisabledOptionSupported
};
