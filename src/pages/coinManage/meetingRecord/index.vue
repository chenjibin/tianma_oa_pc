<template>
    <div class="">
        <vue-tuicalendar
            ref="calendar"
            :options="options"
            :schedules="schedules"
            @after-render-schedule="handler"
            @before-render-schedule="handler"
            @click-schedule="handler"
        >
        </vue-tuicalendar>
    </div>
</template>

<script>
import { VueTuicalendar } from '@lkmadushan/vue-tuicalendar'
import 'tui-calendar/dist/tui-calendar.min.css'
export default {
    components: {VueTuicalendar},
    data() {
        return {
            options: {

            },
            schedules: [
                {
                    id: "1",
                    calendarId: "1",
                    title: "A schedule",
                    category: "time",
                    dueDateClass: "",
                    start: "2018-05-22T22:30:00+09:00",
                    end: "2018-05-23T02:30:00+09:00"
                },
                {
                    id: "2",
                    calendarId: "1",
                    title: "Another schedule",
                    category: "time",
                    dueDateClass: "",
                    start: "2018-05-23T17:30:00+09:00",
                    end: "2018-05-24T17:31:00+09:00",
                    isReadOnly: true
                }
            ]
        }
    },
    mounted() {
        setTimeout(() => {
            this.$refs.calendar.fireMethod('clear');
            this.$refs.calendar.fireMethod('getElement');
            this.$refs.calendar.fireMethod('changeView', 'month', true);
            this.$refs.calendar.registerEvent('beforeDeleteSchedule', (event) => {
                // do stuff here
            });
        }, 20)
    },
    methods: {
        handler() {
        }
    }
 }
</script>
