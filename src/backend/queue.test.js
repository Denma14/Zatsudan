import { expect, test, describe } from "vitest";
import { sum, add_message, get_messages } from "./queue.js";
test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
});
describe("queue.ts", () => {
    test("pushes a message and removes last message if capacity exceeds 10k", () => {
        for (let i = 1; i <= 10000; i++) {
            const message = add_message(`message ${i}`, "xdx");
            expect(message).toEqual({ id: "xdx", message: `message ${i}` });
            expect(message?.id).toBe("xdx");
        }
        const message_queue_before_overflow = get_messages();
        expect(message_queue_before_overflow.length).toBe(10000);
        expect(message_queue_before_overflow[0]).toStrictEqual({
            id: "xdx",
            message: "message 1",
        });
        add_message("message 10001", "xdx");
        const message_queue_after_overflow = get_messages();
        expect(message_queue_after_overflow.length).toBe(10000);
        expect(message_queue_after_overflow[0]).toStrictEqual({
            id: "xdx",
            message: "message 2",
        });
        expect(message_queue_after_overflow[9999]).toStrictEqual({
            id: "xdx",
            message: "message 10001",
        });
    });
});
//# sourceMappingURL=queue.test.js.map