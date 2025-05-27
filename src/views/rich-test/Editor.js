import { ScriptLoader } from '@/utils/ScriptLoader';
import { getTinymce } from './TinyMCE';
import {
  isTextarea,
  mergePlugins,
  uuid,
  initEditor,
  isDisabledOptionSupported
} from './Utils';
import {
  h,
  defineComponent,
  onMounted,
  ref,
  toRefs,
  nextTick,
  watch,
  onBeforeUnmount,
  onActivated,
  onDeactivated
} from 'vue';

const renderInline = (ce, id, elementRef, tagName) =>
  ce(tagName ? tagName : 'div', {
    id,
    ref: elementRef
  });

const renderIframe = (ce, id, elementRef) =>
  ce('textarea', {
    id,
    visibility: 'hidden',
    ref: elementRef
  });

const defaultInitValues = { selector: undefined, target: undefined };

export const Editor = defineComponent({
  props: {
    cloudChannel: String,
    id: String,
    init: Object,
    initialValue: String,
    inline: Boolean,
    modelEvents: [String, Array],
    plugins: [String, Array],
    tagName: String,
    toolbar: [String, Array],
    modelValue: String,
    disabled: Boolean,
    readonly: Boolean,
    outputFormat: {
      type: String,
      validator: (prop) => prop === 'html' || prop === 'text'
    },
  },
  setup: (props, ctx) => {
    let conf = props.init ? { ...props.init, ...defaultInitValues } : { ...defaultInitValues };
    const { disabled, readonly, modelValue, tagName } = toRefs(props);
    const element = ref(null);
    let vueEditor = null;
    const elementId = props.id || uuid('tiny-vue');
    const inlineEditor = (props.init && props.init.inline) || props.inline;
    const modelBind = !!ctx.attrs['onUpdate:modelValue'];
    let mounting = true;
    const initialValue = props.initialValue ? props.initialValue : '';
    let cache = '';

    const getContent = (isMounting) => modelBind
      ? () => (modelValue?.value ? modelValue.value : '')
      : () => isMounting ? initialValue : cache;

    const initWrapper = () => {
      const content = getContent(mounting);
      const finalInit = {
        ...conf,
        language:'zh_CN',
        readonly: props.readonly,
        disabled: props.disabled,
        branding: props.init?.branding ?? false,
        target: element.value,
        plugins: mergePlugins(conf.plugins, props.plugins),
        toolbar: props.toolbar || conf.toolbar,
        inline: inlineEditor,
        setup: (editor) => {
          vueEditor = editor;
          editor.on('init', (e) => initEditor(e, props, ctx, editor, modelValue, content));
          if (typeof conf.setup === 'function') {
            conf.setup(editor);
          }
        }
      };
      if (isTextarea(element.value)) {
        element.value.style.visibility = '';
      }
      getTinymce().init(finalInit);
      mounting = false;
    };

    watch(readonly, (isReadonly) => {
      if (vueEditor !== null && isDisabledOptionSupported(vueEditor)) {
        if (typeof vueEditor.mode?.set === 'function') {
          vueEditor.mode.set(isReadonly ? 'readonly' : 'design');
        } else {
          vueEditor.setMode(isReadonly ? 'readonly' : 'design');
        }
      }
    });

    watch(disabled, (disable) => {
      if (vueEditor !== null) {
        if (isDisabledOptionSupported(vueEditor)) {
          vueEditor.options.set('disabled', disable);
        } else {
          if (typeof vueEditor.mode?.set === 'function') {
            vueEditor.mode.set(disable ? 'readonly' : 'design');
          } else {
            vueEditor.setMode(disable ? 'readonly' : 'design');
          }
        }
      }
    });

    watch(tagName, () => {
      if (vueEditor) {
        if (!modelBind) {
          cache = vueEditor.getContent();
        }
        getTinymce()?.remove(vueEditor);
        nextTick(() => initWrapper());
      }
    });

    onMounted(() => {
      if (getTinymce() !== null) {
        initWrapper();
      } else if (element.value && element.value.ownerDocument) {
        const scriptSrc = '/tinymce/tinymce.min.js';

        ScriptLoader.load(
          element.value.ownerDocument,
          scriptSrc,
          initWrapper
        );
      }
    });

    onBeforeUnmount(() => {
      if (getTinymce() !== null) {
        getTinymce().remove(vueEditor);
      }
    });

    if (!inlineEditor) {
      onActivated(() => {
        if (!mounting) {
          initWrapper();
        }
      });
      onDeactivated(() => {
        if (vueEditor) {
          if (!modelBind) {
            cache = vueEditor.getContent();
          }
          getTinymce()?.remove(vueEditor);
        }
      });
    }

    const rerender = (init) => {
      if (vueEditor) {
        cache = vueEditor.getContent();
        getTinymce()?.remove(vueEditor);
        conf = { ...conf, ...init, ...defaultInitValues };
        nextTick(() => initWrapper());
      }
    };

    ctx.expose({
      rerender,
      getEditor: () => vueEditor
    });

    return () => inlineEditor
      ? renderInline(h, elementId, element, props.tagName)
      : renderIframe(h, elementId, element);
  }
});
