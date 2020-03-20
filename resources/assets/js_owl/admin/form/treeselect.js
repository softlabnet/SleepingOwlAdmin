import { TreeSelect } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { relativeTimeThreshold } from 'moment';

Vue.component('element-treeselect', {
    name: 'element-treeselect',
    props: {
        name: {
            type: String,
            required: true
        },
        options: {
            required: false,
            default: ''
        },
        value: {
            required: false,
            default: null
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false
        },
        parent: {
            type: String,
            required: false,
            default: ''
        },
        url: {
            type: String,
            required: false,
            default: ''
        }
    },
    data () {
        return {
            list: null,
            val: null,
            formFieldName: 'tree_select_hidden_' + this.name.replace('[]','_'),
            selected: null
        }
    },
    template: '<div> \
        <a-tree-select \
            allowClear \
            showSearch \
            style="width: 100%" \
            :treeData="list" \
            v-model="val" \
            :treeCheckable="multiple" \
            :multiple="multiple" \
            treeNodeFilterProp="title" \
            searchPlaceholder="Please select" \
            @select="onSelect" \
            @change="onChange" \
            :dropdownStyle="{ maxHeight: \'400px\', overflow: \'auto\' }" \
        /> \
        <div :id="formFieldName"> \
        </div> \
        </div>',
    mounted () {
        const self = this;
        self.list = self.options;
        self.val = self.value;
        this.createHiddenFields(self.value);
        this.$root.$on('parent_change', (event) => {
            if(event.parent != this.name && event.parent == this.parent && this.parent){
                let parent_filter_id = event.value;
                const self = this;
                self.val = null;
                this.createHiddenFields(self.val);
                $.ajax({
                    url: self.url,
                    data:{
                        parent_filter_id: parent_filter_id
                    },  
                    method: 'POST',
                    dataType: 'JSON',
                    success: function(data) {
                        self.list = [];
                        $.each(data.output, function(index,item){
                            self.list.push({key: item.id, label: item.name, value: item.id});
                        })
                        // this.val = '';                        
                    },
                    error: function(data) {
                        console.log(data);
                    },
                });
            }
        });
    },
    components: {
        TreeSelect
    },
    methods: {
        createHiddenFields(values){
            values = Array.isArray(values)?values:[values];
            $('#' + this.formFieldName).html('');
            if(values){
                const self = this;
                $.each(values, function(i, v){
                    $('<input>').attr({
                        type: 'hidden',
                        value: v,
                        name: self.name
                    }).appendTo('#' + self.formFieldName);
                });
            }
        },
        onSelect(value, node, extra){
//            this.createHiddenFields(value);
//            this.$root.$emit('parent_change', {value: value, parent: this.name, node: node});
        },
        onChange(value, node) {
            this.createHiddenFields(value);
            this.$root.$emit('parent_change', {value: value, parent: this.name, node: node});
        }
    }
});
