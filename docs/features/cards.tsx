import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

const t =
  "This is placeholder paragraph with some text about nothing. More text is here to add length to the paragraph.";

md`
# :icons/border-all: Cards

>> # :icons/circle-info: Heading 1
>> ${t}
>
>> ## :icons/circle-info: Heading 2
>> ${t}
>
>> ### :icons/circle-info: Heading 3
>> ${t}
>
>> #### :icons/circle-info: Heading 4
>> ${t}
>
>> ##### :icons/circle-info: Heading 5
>> ${t}
>
>> ###### :icons/circle-info: Heading 6
>> ${t}
>
>> :icons/circle-info: Paragraph
>>
>> ${t}
`;

md`
# Info Boxes

>> - # :icons/circle-info: This is an info box.
>>   ${t}
>
>> - ## :icons/circle-info: This is an info box.
>>   ${t}
>
>> - ### :icons/circle-info: This is an info box.
>>   ${t}
>
>> - #### :icons/circle-info: This is an info box.
>>   ${t}
>
>> - ##### :icons/circle-info: This is an info box.
>>   ${t}
>
>> - ###### :icons/circle-info: This is an info box.
>>   ${t}
>
>> - :icons/circle-info: This is an info box.
>>
>>   ${t}
`;

md`
# Items

>> - # :icons/circle-info: This is an info box.
>
>> - ## :icons/circle-info: This is an info box.
>
>> - ### :icons/circle-info: This is an info box.
>
>> - #### :icons/circle-info: This is an info box.
>
>> - ##### :icons/circle-info: This is an info box.
>
>> - ###### :icons/circle-info: This is an info box.
>
>> - :icons/circle-info: This is an info box.
`;
