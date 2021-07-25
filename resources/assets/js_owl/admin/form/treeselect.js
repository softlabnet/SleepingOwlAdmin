import { TreeSelect, Spin } from 'ant-design-vue';
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
        parent_filter_id:{
            required: false,
            default: null
        },
        attribute_id:{
            required: false,
            default: null
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
            selected: null,
            disabled: false,
            loading:true,
        }
    },
    template: '<div> \
        <a-spin :spinning="loading"> \
        <a-tree-select \
            :disabled="disabled" \
            allowClear \
            showSearch \
            style="width: 100%" \
            :treeData="list" \
            :loading="loading" \
            v-model="val" \
            :treeCheckable="multiple" \
            :multiple="multiple" \
            treeNodeFilterProp="title" \
            searchPlaceholder="Выберите значение" \
            @select="onSelect" \
            @change="onChange" \
            :dropdownStyle="{ maxHeight: \'400px\', overflow: \'auto\' }" \
        /> \
        </a-spin> \
        <div :id="formFieldName"> \
        </div> \
        </div>',
    mounted () {
        const self = this;
        self.list = [];//self.options;
        self.val = self.value;
        this.createHiddenFields(self.value);
        this.loadData(this.url, this.parent_filter_id);
        this.$root.$on('parent_change', (event) => {
            if(event.parent != this.name && event.parent == this.parent && this.parent){
                let parent_filter_id = event.value;
                const self = this;
                self.val = null;
                this.createHiddenFields(self.val);
                this.loadData(self.url, parent_filter_id);
            }
        });
    },
    components: {
        TreeSelect, Spin
    },
    methods: {
        loadData(url, parent_filter_id = null){
            //this.disabled = true;
            this.loading = true;
            let self = this;
            $.ajax({
                url: url,
                data:{
                    parent_filter_id: parent_filter_id,
                    attribute_id: self.attribute_id
                },  
                method: 'POST',
                dataType: 'JSON',
                success: function(data) {
                    self.list = data.output;
                    //self.disabled = false;
                    self.loading = false;
                    //$.each(data.output, function(index,item){
                    //    self.list.push({key: item.id, label: item.name, value: item.id});
                    //})
                    // this.val = '';                        
                },
                error: function(data) {
                    console.log(data);
                },
            });
    },
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
