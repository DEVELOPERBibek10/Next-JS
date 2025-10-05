import TopicCreateForm from "@/components/Topic/topicCreateForm";

export default async function Home() {
  return (
    <div className="grid grid-cols-5 gap-4 py-4">
      <div className="col-span-4 ">
        <h1 className="text-2xl font-semibold">Home</h1>
      </div>
      <div className="">
        <div className="">
          <TopicCreateForm />
        </div>
      </div>
    </div>
  );
}
