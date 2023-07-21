using System.Collections;
using System;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly StoreContext _Context;
    private Hashtable _repositories;

    public UnitOfWork(StoreContext context) => (_Context) = (context);

    public async Task<int> Complete()
    {
        return await _Context.SaveChangesAsync();
    }
    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        if (_repositories == null) _repositories = new Hashtable();
        var type = typeof(TEntity).Name;
        if (!_repositories.ContainsKey(type))
        {
            var repositoryType = typeof(GenericRepository<>);
            var repositoryInstance = Activator
                .CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _Context);
            _repositories.Add(type, repositoryInstance);
        }
        return (IGenericRepository<TEntity>)_repositories[type];
    }

    public void Dispose()
    {
        _Context.Dispose();
    }
}
