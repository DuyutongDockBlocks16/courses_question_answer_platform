from fastapi import Request, FastAPI
from .models import generator

app = FastAPI()

COURSE_DETAILS = {
    "CS-E4265 - Multimedia Systems": "Content Delivery Networks (CDN), video streaming, immersive and interactive multimedia, Quality of Experience (QoE) in multimedia systems",
    "CS-E4715 - Supervised Machine Learning": "Generalization error analysis and estimation; Model selection; Optimization and computational complexity; Linear models; Support vector machines and kernel methods; Ensemble methods; Feature selection and sparsity; Multi-layer perceptrons; Multi-class classification; Preference learning",
    "ELEC-C7420 - Basic principles in networking": "This course provides a theoretical and practical basis for computer networking. Besides basic networking principles, the course provides case studies of network protocols at each layer of the OSI model. Examples include HTTP and TCP/IP for data center networking, Bluetooth and Bluetooth Low Energy for short-distance device-to-device communication, and symmetric and asymmetric encryption protocols and VPN for secure communications.",
    "CS-C3170 - Web Software Development": "Student understands what web applications are, how they function, and how they are constructed. Student understands the responsibilities of client-side web applications and server-side web applications, and is able to design, implement, and test web applications. Student understands and applies up-to-date development and deployment strategies. "
}

@app.get("/")
async def main():
    return "POST a message with a JSON document that has a 'question' key."

@app.post("/")
async def ask_question(request: Request):
    data = await request.json()
    course_name = data["course_name"]
    course_content = COURSE_DETAILS[course_name]
    question_id = data["question_id"]
    question_title = data["question_title"]

    print(f"course_name: {course_name}")
    print(f"course_content: {course_content}")
    print(f"question_id: {question_id}")
    print(f"question_title: {question_title}")
    final_question = "About the course: " + course_name + " whose content is " + course_content + "Here is a question:" \
               + question_title + "Could you please try to answer this question?"

    print(f"final_question: {final_question}")

    answer = generator(final_question)[0]["generated_text"][len(final_question):].strip()

    print(f"answer: {answer}")

    return answer

    # return generator(final_question)
