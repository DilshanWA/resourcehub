"use client";

import { useActionState } from "react";
import {
  createResource,
  updateResource,
  type ResourceState,
} from "@/app/actions/resources";

type ResourcesFormProps = {
  resourceId?: number;
  initialName?: string;
  initialType?: string;
  initialLocation?: string;
  initialDescription?: string;
};

const initialState: ResourceState = {};

export default function ResourcesForm({
  resourceId,
  initialName = "",
  initialType = "",
  initialLocation = "",
  initialDescription = "",
}: ResourcesFormProps) {
  const [state, formAction, pending ] = useActionState(
    resourceId ? updateResource : createResource,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-6 max-w-3xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {resourceId && <input type="hidden" name="resourceId" value={resourceId} />}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
          Resource name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={150}
          defaultValue={initialName}
          placeholder="Conference room A"
          className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="type" className="mb-2 block text-sm font-semibold text-slate-700">
          Type
        </label>
        <input
          id="type"
          name="type"
          required
          maxLength={100}
          defaultValue={initialType}
          placeholder="Meeting room"
          className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-700">
          Location <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="location"
          name="location"
          maxLength={255}
          defaultValue={initialLocation}
          placeholder="First floor"
          className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={5000}
          defaultValue={initialDescription}
          placeholder="Describe this resource..."
          className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg cursor-pointer bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving..." : resourceId ? "Save changes" : "Create resource"}
      </button>
    </form>
  );
}
