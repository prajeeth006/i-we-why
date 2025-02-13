using System;
using System.Collections.Concurrent;
using Frontend.Gantry.Shared.Core.Common.Enums;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Gantry.Shared.Core.BackgroundJob
{
    public interface IJobScheduler
    {
        public void StartJob<TJob>() where TJob : IJob;
        public void StopJob<TJob>() where TJob : IJob;
        public Dictionary<string, string> GetJobs();
    }

    public class JobScheduler : IJobScheduler
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ConcurrentDictionary<Type, IJob> _jobs = new ConcurrentDictionary<Type, IJob>();

        public JobScheduler(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void StartJob<TJob>() where TJob : IJob
        {
            _jobs.AddOrUpdate(typeof(TJob), AddJob, UpdateValueFactory);
        }

        public void StopJob<TJob>() where TJob : IJob
        {
            var job = _jobs.FirstOrDefault(x => x.Key == typeof(TJob)).Value;
            if (job != null)
            {
                job.Stop();
            }
        }

        public Dictionary<string, string> GetJobs()
        {
            var jobsToSerialize = new Dictionary<string, string>();
            foreach (var kvp in _jobs)
            {
                jobsToSerialize[kvp.Key.FullName] = kvp.Value.Status.ToString();
            }
            jobsToSerialize["Server"] = Environment.MachineName;
            return jobsToSerialize;
        }

        private IJob UpdateValueFactory(Type type, IJob oldJob)
        {
            if (oldJob.Status == JobStatus.Running)
            {
                return oldJob;
            }

            oldJob.Stop();

            return CreateAndStartJob(type);
        }

        private IJob AddJob(Type type)
        {
            return CreateAndStartJob(type);
        }

        private IJob CreateAndStartJob(Type type)
        {
            var job = (IJob)_serviceProvider.GetRequiredService(type);

            job.Start();

            return job;
        }
    }
}
