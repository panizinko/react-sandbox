import { useServices } from "../hooks/useServices";

interface Service {
  id: string;
  name: string;
  type: string;
  cloud: string;
  region: string;
  status: string;
  version: string;
  owner: string;
  team: string;
}

export function ServiceList() {
  const { data: services, isLoading, error, isError } = useServices();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        Loading services...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-red-50 text-red-600 p-4 rounded-md'>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-900 text-left'>
        Services
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {services.map((service: Service) => (
          <div
            key={service.id}
            className='bg-white rounded-lg shadow p-6 space-y-4'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='font-medium text-lg text-gray-900'>
                  {service.name}
                </h3>
                <p className='text-sm text-gray-500'>{service.type}</p>
              </div>
              <span
                className={`px-2 py-1 text-sm rounded-full ${
                  service.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : service.status === "DEGRADED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {service.status}
              </span>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center text-sm'>
                <span className='text-gray-500 w-20'>Cloud:</span>
                <span className='text-gray-700'>{service.cloud}</span>
              </div>
              <div className='flex items-center text-sm'>
                <span className='text-gray-500 w-20'>Region:</span>
                <span className='text-gray-700'>{service.region}</span>
              </div>
              <div className='flex items-center text-sm'>
                <span className='text-gray-500 w-20'>Team:</span>
                <span className='text-gray-700'>{service.team}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
