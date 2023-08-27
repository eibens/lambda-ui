import lit from "litdoc/lit";

export const doc = lit();
const { md } = doc;

const t = "This is placeholder paragraph that is extra large.";

md`
# :border-all: Cards

>> # :circle-info: Heading 1
>> ${t}
>
>> ## :circle-info: Heading 2
>> ${t}
>
>> ### :circle-info: Heading 3
>> ${t}
>
>> #### :circle-info: Heading 4
>> ${t}
>
>> ##### :circle-info: Heading 5
>> ${t}
>
>> ###### :circle-info: Heading 6
>> ${t}
`;

md`
# Info Boxes

>> - # :circle-info: This is an info box.
>
>> - ## :circle-info: This is an info box.
>
>> - ### :circle-info: This is an info box.
>
>> - #### :circle-info: This is an info box.
>
>> - ##### :circle-info: This is an info box.
>
>> - ###### :circle-info: This is an info box.
>
>> - :circle-info: This is an info box.
`;
