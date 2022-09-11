using Microsoft.EntityFrameworkCore;
using MjCalcApi.AppServices.IRepository;
using MjCalcApi.Domain.Data;
using MjCalcApi.Domain.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MjCalcApi.AppServices.Repository
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        #region property
        private readonly MjCalcDbContext _applicationDbContext;
        private DbSet<T> entities;
        #endregion
        #region Constructor
        public Repository(MjCalcDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
            entities = _applicationDbContext.Set<T>();
        }
        #endregion
        public void Delete(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Remove(entity);
            _applicationDbContext.SaveChanges();
        }
        public T? Get(int Id)
        {
            return entities.SingleOrDefault(c => c.Id == Id);
        }
        public IEnumerable<T> GetAll()
        {
            return entities.AsEnumerable();
        }

        public DbSet<T> GetDb()
        {
            return entities;
        }

        public void Insert(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Add(entity);
            _applicationDbContext.SaveChanges();
        }
        public void Remove(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Remove(entity);
        }
        public void SaveChanges()
        {
            _applicationDbContext.SaveChanges();
        }
        public void Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            entities.Update(entity);
            _applicationDbContext.SaveChanges();
        }
    }
}